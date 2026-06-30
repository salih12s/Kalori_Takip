import type { DailyLog, Food, FoodAlias, FoodEntry, Meal } from "@prisma/client";

import type {
  DailyTotalsResponse,
  FoodEntryResponse,
  FoodResponse,
  FoodSearchResultResponse,
  MealResponse
} from "./nutrition.types.js";
import type { ExternalFoodSearchResult } from "./external/external-food.types.js";

type FoodWithAliases = Food & { aliases: FoodAlias[] };
type MealWithEntries = Meal & { entries: FoodEntry[] };

export function toFoodResponse(food: FoodWithAliases): FoodResponse {
  return {
    id: food.id,
    userId: food.userId,
    name: food.name,
    servingSize: Number(food.servingSize),
    servingUnit: food.servingUnit,
    calories: food.calories,
    protein: Number(food.protein),
    carbs: Number(food.carbs),
    fat: Number(food.fat),
    fiber: food.fiber != null ? Number(food.fiber) : null,
    sugar: food.sugar != null ? Number(food.sugar) : null,
    source: food.source,
    externalProvider: food.externalProvider,
    externalId: food.externalId,
    aliases: food.aliases.map((alias) => alias.alias),
    createdAt: food.createdAt,
    updatedAt: food.updatedAt
  };
}

export function toLocalFoodSearchResult(food: FoodWithAliases): FoodSearchResultResponse {
  const isCached = food.source === "OPEN_FOOD_FACTS";

  return {
    id: food.id,
    externalId: food.externalId,
    provider: food.externalProvider === "OPEN_FOOD_FACTS" ? "OPEN_FOOD_FACTS" : null,
    name: food.name,
    servingSize: Number(food.servingSize),
    servingUnit: food.servingUnit,
    calories: food.calories,
    protein: Number(food.protein),
    carbs: Number(food.carbs),
    fat: Number(food.fat),
    fiber: food.fiber != null ? Number(food.fiber) : null,
    sugar: food.sugar != null ? Number(food.sugar) : null,
    source: isCached ? "CACHED" : "LOCAL",
    canAddDirectly: true,
    canImport: false
  };
}

export function toExternalFoodSearchResult(food: ExternalFoodSearchResult): FoodSearchResultResponse {
  return {
    id: null,
    externalId: food.externalId,
    provider: food.provider,
    name: food.name,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
    sugar: food.sugar,
    source: "EXTERNAL",
    canAddDirectly: false,
    canImport: true
  };
}

export function toFoodEntryResponse(entry: FoodEntry): FoodEntryResponse {
  return {
    id: entry.id,
    mealId: entry.mealId,
    foodId: entry.foodId,
    foodNameSnapshot: entry.foodNameSnapshot,
    quantity: Number(entry.quantity),
    unit: entry.unit,
    calories: entry.calories,
    protein: Number(entry.protein),
    carbs: Number(entry.carbs),
    fat: Number(entry.fat),
    fiber: entry.fiber != null ? Number(entry.fiber) : null,
    sugar: entry.sugar != null ? Number(entry.sugar) : null,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt
  };
}

export function toMealResponse(meal: MealWithEntries): MealResponse {
  return {
    id: meal.id,
    mealType: meal.mealType,
    date: meal.date,
    entries: meal.entries.map(toFoodEntryResponse)
  };
}

export function toDailyTotalsResponse(dailyLog: DailyLog): DailyTotalsResponse {
  return {
    id: dailyLog.id,
    date: dailyLog.date,
    totalCalories: dailyLog.totalCalories,
    totalProtein: Number(dailyLog.totalProtein),
    totalCarbs: Number(dailyLog.totalCarbs),
    totalFat: Number(dailyLog.totalFat)
  };
}
