import { api, type ApiResponse } from "../../../lib/api";
import type {
  AddFoodEntryPayload,
  AddFoodEntryResponse,
  CreateFoodPayload,
  DailyMealsResponse,
  DailyTotalsResponse,
  FoodResponse,
} from "../types/nutrition.types";

export const nutritionApi = {
  async searchFoods(query: string): Promise<FoodResponse[]> {
    const res = await api.get<ApiResponse<{ foods: FoodResponse[] }>>("/foods/search", { q: query });
    return res.data?.foods ?? [];
  },

  async createFood(payload: CreateFoodPayload): Promise<FoodResponse> {
    const res = await api.post<ApiResponse<{ food: FoodResponse }>>("/foods", payload);
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
