import type { DailyLog, Food, FoodAlias, FoodEntry, Meal } from "@prisma/client";

import type {
  DailyTotalsResponse,
  FoodEntryResponse,
  FoodResponse,
  MealResponse
} from "./nutrition.types.js";

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
    source: food.source,
    aliases: food.aliases.map((alias) => alias.alias),
    createdAt: food.createdAt,
    updatedAt: food.updatedAt
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
