export type ExternalFoodProvider = "OPEN_FOOD_FACTS";

export type ExternalFoodSearchResult = {
  externalId: string;
  provider: ExternalFoodProvider;
  name: string;
  imageUrl?: string | null;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  aliases: string[];
};

export type ExternalFoodSearchResponse = {
  foods: ExternalFoodSearchResult[];
  failed: boolean;
};

export interface ExternalFoodProviderClient {
  search(query: string): Promise<ExternalFoodSearchResponse>;
}
