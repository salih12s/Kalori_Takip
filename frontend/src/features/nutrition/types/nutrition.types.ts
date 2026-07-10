export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
export type FoodSource = "LOCAL" | "USER_CREATED" | "USDA" | "OPEN_FOOD_FACTS";
export type FoodSearchSource = "curated" | "all" | "local" | "external";
export type FoodResultSource = "LOCAL" | "CACHED" | "EXTERNAL";

export interface FoodResponse {
  id: string;
  userId: string | null;
  name: string;
  imageUrl: string | null;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  source: FoodSource;
  externalProvider: string | null;
  externalId: string | null;
  aliases: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodSearchResult {
  id: string | null;
  externalId: string | null;
  provider: "OPEN_FOOD_FACTS" | null;
  name: string;
  imageUrl: string | null;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  source: FoodResultSource;
  canAddDirectly: boolean;
  canImport: boolean;
}

export interface FoodSearchResponse {
  foods: FoodSearchResult[];
  externalSearchFailed: boolean;
}

export interface FoodEntryResponse {
  id: string;
  mealId: string;
  foodId: string | null;
  foodNameSnapshot: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MealResponse {
  id: string;
  mealType: MealType;
  date: string;
  entries: FoodEntryResponse[];
}

export interface DailyTotalsResponse {
  id: string;
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export type MealsByType = Record<MealType, MealResponse | null>;

export interface DailyMealsResponse {
  dailyTotals: DailyTotalsResponse;
  meals: MealsByType;
}

export interface CreateFoodPayload {
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  aliases?: string[];
}

export interface ImportExternalFoodPayload {
  externalId: string;
  provider: "OPEN_FOOD_FACTS";
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number | null;
  sugar?: number | null;
  aliases?: string[];
}

export interface AddFoodEntryPayload {
  date: string;
  mealType: MealType;
  foodId: string;
  quantity: number;
  unit: string;
}

export interface AddFoodEntryResponse {
  entry: FoodEntryResponse;
  dailyTotals: DailyTotalsResponse;
}
