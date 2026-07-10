import { getCommonFoodFallback } from "./common-food-fallbacks.js";
import { mapOpenFoodFactsProduct } from "./external-food.mapper.js";
import type { ExternalFoodProviderClient, ExternalFoodSearchResponse, ExternalFoodSearchResult } from "./external-food.types.js";

type OpenFoodFactsSearchResponse = {
  products?: unknown[];
};

type CacheEntry = ExternalFoodSearchResponse & {
  expiresAt: number;
};

const queryAliases = new Map<string, string>([
  ["yumurta", "egg"],
  ["haslanmis yumurta", "boiled egg"],
  ["siyah zeytin", "black olives"],
  ["yesil zeytin", "green olives"],
  ["tavuk", "chicken"],
  ["pilav", "rice"],
  ["pirinc", "rice"],
  ["yogurt", "yogurt"],
  ["sut", "milk"],
  ["peynir", "cheese"],
  ["ekmek", "bread"],
  ["makarna", "pasta"],
  ["muz", "banana"],
  ["elma", "apple"],
  ["patates", "potato"],
  ["ton baligi", "tuna"],
  ["yulaf", "oats"]
]);

const searchFields = [
  "code",
  "product_name",
  "product_name_en",
  "generic_name",
  "brands",
  "serving_quantity",
  "serving_size",
  "image_front_url,image_url",
  "nutriments"
].join(",");

const successCacheTtlMs = 20 * 60 * 1000;
const failureCacheTtlMs = 2 * 60 * 1000;
const circuitPauseMs = 60 * 1000;
const circuitFailureThreshold = 3;

export class OpenFoodFactsProvider implements ExternalFoodProviderClient {
  private cache = new Map<string, CacheEntry>();
  private failureWindowStartedAt = 0;
  private failureCount = 0;
  private circuitOpenUntil = 0;
  private lastLoggedFailures = new Map<string, number>();

  async search(query: string): Promise<ExternalFoodSearchResponse> {
    const normalizedQuery = this.normalizeQuery(query);

    if (normalizedQuery.length < 3) {
      return { foods: [], failed: false };
    }

    const cacheKey = `open-food-facts:${normalizedQuery}`;
    const cached = this.readCache(cacheKey);

    if (cached) {
      return cached;
    }

    const queries = this.buildQueries(normalizedQuery);
    const fallbackFoods = this.getFallbackFoods(queries);

    if (this.isCircuitOpen()) {
      const response = { foods: fallbackFoods, failed: fallbackFoods.length === 0 };
      this.writeCache(cacheKey, response, failureCacheTtlMs);
      return response;
    }

    let failedAttempts = 0;

    for (const searchQuery of queries) {
      const result = await this.fetchSearch(searchQuery);

      if (result.failed) {
        failedAttempts += 1;
        this.recordFailure(searchQuery);
        continue;
      }

      this.recordSuccess();
      const foods = this.mergeFoods(fallbackFoods, result.foods);

      if (foods.length > 0 || searchQuery === queries[queries.length - 1]) {
        const response = { foods, failed: false };
        this.writeCache(cacheKey, response, successCacheTtlMs);
        return response;
      }
    }

    const response = {
      foods: fallbackFoods,
      failed: fallbackFoods.length === 0 && failedAttempts === queries.length
    };
    this.writeCache(cacheKey, response, response.failed ? failureCacheTtlMs : successCacheTtlMs);
    return response;
  }

  private normalizeQuery(query: string): string {
    return query
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/\u00e7/g, "c")
      .replace(/\u011f/g, "g")
      .replace(/\u0131/g, "i")
      .replace(/\u00f6/g, "o")
      .replace(/\u015f/g, "s")
      .replace(/\u00fc/g, "u")
      .replace(/\s+/g, " ");
  }

  private buildQueries(query: string): string[] {
    const alias = queryAliases.get(query);

    return alias && alias !== query ? [alias, query] : [query];
  }

  private getFallbackFoods(queries: string[]): ExternalFoodSearchResult[] {
    return this.mergeFoods(
      [],
      queries
        .map((query) => getCommonFoodFallback(this.normalizeQuery(query)))
        .filter((food): food is ExternalFoodSearchResult => food !== null)
    );
  }

  private mergeFoods(
    firstFoods: ExternalFoodSearchResult[],
    secondFoods: ExternalFoodSearchResult[]
  ): ExternalFoodSearchResult[] {
    const foodsById = new Map<string, ExternalFoodSearchResult>();

    for (const food of [...firstFoods, ...secondFoods]) {
      foodsById.set(food.externalId, food);
    }

    return Array.from(foodsById.values()).slice(0, 10);
  }

  private async fetchSearch(query: string): Promise<ExternalFoodSearchResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    try {
      const params = new URLSearchParams({
        search_terms: query,
        search_simple: "1",
        action: "process",
        json: "1",
        page_size: "10",
        fields: searchFields
      });
      const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`, {
        signal: controller.signal,
        headers: {
          "User-Agent": "FitBoard/0.1 (https://github.com/salih12s/Kalori_Takip)"
        }
      });

      if (!response.ok) {
        this.logFailure(query, response.status);
        return { foods: [], failed: true };
      }

      const body = (await response.json()) as OpenFoodFactsSearchResponse;
      const foods = (body.products ?? [])
        .map((product) => mapOpenFoodFactsProduct(product as never))
        .filter((food): food is NonNullable<typeof food> => food !== null)
        .slice(0, 10);

      return { foods, failed: false };
    } catch (error) {
      this.logFailure(query, error instanceof Error ? error.name : "UnknownError");
      return { foods: [], failed: true };
    } finally {
      clearTimeout(timeout);
    }
  }

  private logFailure(query: string, reason: string | number) {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const key = `${query}:${reason}`;
    const now = Date.now();
    const lastLoggedAt = this.lastLoggedFailures.get(key) ?? 0;

    if (now - lastLoggedAt > failureCacheTtlMs) {
      this.lastLoggedFailures.set(key, now);
      console.warn("Open Food Facts search failed", { queryLength: query.length, reason });
    }
  }

  private readCache(key: string): ExternalFoodSearchResponse | null {
    const entry = this.cache.get(key);

    if (!entry || entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return { foods: entry.foods, failed: entry.failed };
  }

  private writeCache(key: string, value: ExternalFoodSearchResponse, ttlMs: number) {
    this.cache.set(key, { ...value, expiresAt: Date.now() + ttlMs });
  }

  private isCircuitOpen(): boolean {
    return this.circuitOpenUntil > Date.now();
  }

  private recordFailure(query: string) {
    const now = Date.now();

    if (now - this.failureWindowStartedAt > circuitPauseMs) {
      this.failureWindowStartedAt = now;
      this.failureCount = 0;
    }

    this.failureCount += 1;

    if (this.failureCount >= circuitFailureThreshold) {
      this.circuitOpenUntil = now + circuitPauseMs;
      this.logFailure(query, "circuit_open");
    }
  }

  private recordSuccess() {
    this.failureCount = 0;
    this.failureWindowStartedAt = 0;
    this.circuitOpenUntil = 0;
  }
}
