import { getCommonFoodFallback } from "./common-food-fallbacks.js";
import { mapOpenFoodFactsProduct } from "./external-food.mapper.js";
import type { ExternalFoodSearchResult } from "./external-food.types.js";
import type { ExternalFoodProviderClient, ExternalFoodSearchResponse } from "./external-food.types.js";

type OpenFoodFactsSearchResponse = {
  products?: unknown[];
};

const QUERY_ALIASES = new Map<string, string>([
  ["yumurta", "egg"],
  ["haşlanmış yumurta", "boiled egg"],
  ["haslanmis yumurta", "boiled egg"],
  ["tavuk", "chicken"],
  ["pilav", "rice"],
  ["pirinç", "rice"],
  ["pirinc", "rice"],
  ["yoğurt", "yogurt"],
  ["yogurt", "yogurt"],
  ["süt", "milk"],
  ["sut", "milk"],
  ["peynir", "cheese"],
  ["ekmek", "bread"],
  ["makarna", "pasta"],
  ["muz", "banana"],
  ["elma", "apple"],
  ["patates", "potato"],
  ["ton balığı", "tuna"],
  ["ton baligi", "tuna"],
  ["yulaf", "oats"]
]);

const SEARCH_FIELDS = [
  "code",
  "product_name",
  "product_name_en",
  "generic_name",
  "brands",
  "serving_quantity",
  "serving_size",
  "nutriments"
].join(",");

export class OpenFoodFactsProvider implements ExternalFoodProviderClient {
  async search(query: string): Promise<ExternalFoodSearchResponse> {
    const queries = this.buildQueries(query);
    const fallbackFoods = this.getFallbackFoods(queries);
    let failedAttempts = 0;

    for (const searchQuery of queries) {
      const result = await this.fetchSearch(searchQuery);

      if (result.failed) {
        failedAttempts += 1;
        continue;
      }

      const foods = this.mergeFoods(fallbackFoods, result.foods);

      if (foods.length > 0 || searchQuery === queries[queries.length - 1]) {
        return { foods, failed: false };
      }
    }

    return { foods: fallbackFoods, failed: fallbackFoods.length === 0 && failedAttempts === queries.length };
  }

  private buildQueries(query: string): string[] {
    const trimmedQuery = query.trim();
    const alias = QUERY_ALIASES.get(trimmedQuery.toLocaleLowerCase("tr-TR"));

    return alias && alias !== trimmedQuery ? [alias, trimmedQuery] : [trimmedQuery];
  }

  private getFallbackFoods(queries: string[]): ExternalFoodSearchResult[] {
    return this.mergeFoods(
      [],
      queries
        .map((query) => getCommonFoodFallback(query.toLocaleLowerCase("tr-TR")))
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
        fields: SEARCH_FIELDS
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
    if (process.env.NODE_ENV === "development") {
      console.warn("Open Food Facts search failed", { queryLength: query.length, reason });
    }
  }
}
