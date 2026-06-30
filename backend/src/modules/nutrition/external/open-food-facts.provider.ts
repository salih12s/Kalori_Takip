import { mapOpenFoodFactsProduct } from "./external-food.mapper.js";
import type { ExternalFoodProviderClient, ExternalFoodSearchResponse } from "./external-food.types.js";

type OpenFoodFactsSearchResponse = {
  products?: unknown[];
};

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
          "User-Agent": "FitBoard/0.1 (development contact: local)"
        }
      });

      if (!response.ok) {
        return { foods: [], failed: true };
      }

      const body = (await response.json()) as OpenFoodFactsSearchResponse;
      const foods = (body.products ?? [])
        .map((product) => mapOpenFoodFactsProduct(product as never))
        .filter((food): food is NonNullable<typeof food> => food !== null)
        .slice(0, 10);

      return { foods, failed: false };
    } catch {
      return { foods: [], failed: true };
    } finally {
      clearTimeout(timeout);
    }
  }
}
