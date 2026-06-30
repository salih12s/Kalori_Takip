import { api, type ApiResponse } from "../../../lib/api";
import type {
  AddFoodEntryPayload,
  AddFoodEntryResponse,
  CreateFoodPayload,
  DailyMealsResponse,
  DailyTotalsResponse,
  FoodSearchResponse,
  FoodSearchSource,
  FoodResponse,
  ImportExternalFoodPayload,
} from "../types/nutrition.types";

export const nutritionApi = {
  async searchFoods(query: string, source: FoodSearchSource): Promise<FoodSearchResponse> {
    const res = await api.get<ApiResponse<FoodSearchResponse>>("/foods/search", { q: query, source });
    return res.data ?? { foods: [], externalSearchFailed: false };
  },

  async createFood(payload: CreateFoodPayload): Promise<FoodResponse> {
    const res = await api.post<ApiResponse<{ food: FoodResponse }>>("/foods", payload);
    return (res.data as { food: FoodResponse }).food;
  },

  async importExternalFood(payload: ImportExternalFoodPayload): Promise<FoodResponse> {
    const res = await api.post<ApiResponse<{ food: FoodResponse }>>("/foods/import-external", payload);
    return (res.data as { food: FoodResponse }).food;
  },

  async getMeals(date: string): Promise<DailyMealsResponse> {
    const res = await api.get<ApiResponse<DailyMealsResponse>>("/meals", { date });
    return res.data as DailyMealsResponse;
  },

  async addFoodEntry(payload: AddFoodEntryPayload): Promise<AddFoodEntryResponse> {
    const res = await api.post<ApiResponse<AddFoodEntryResponse>>("/meals/entries", payload);
    return res.data as AddFoodEntryResponse;
  },

  async deleteFoodEntry(entryId: string): Promise<{ dailyTotals: DailyTotalsResponse }> {
    const res = await api.delete<ApiResponse<{ dailyTotals: DailyTotalsResponse }>>(`/meals/entries/${entryId}`);
    return res.data as { dailyTotals: DailyTotalsResponse };
  },
};
