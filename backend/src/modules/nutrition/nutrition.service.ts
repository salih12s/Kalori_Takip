import { MealType } from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { normalizeText } from "../../shared/utils/normalize-text.js";
import {
  toDailyTotalsResponse,
  toFoodEntryResponse,
  toFoodResponse,
  toMealResponse
} from "./nutrition.mapper.js";
import { nutritionRepository } from "./nutrition.repository.js";
import type {
  CreateFoodInput,
  CreateMealEntryInput,
  DailyTotalsResponse,
  FoodEntryResponse,
  FoodResponse,
  MealResponse
} from "./nutrition.types.js";

type MealsResult = {
  dailyTotals: DailyTotalsResponse;
  meals: Record<MealType, MealResponse | null>;
};

type EntryResult = {
  entry: FoodEntryResponse;
  dailyTotals: DailyTotalsResponse;
};

const mealTypeOrder = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK];

function uniqueAliases(aliases: string[] | undefined): { alias: string; normalizedAlias: string }[] {
  const aliasMap = new Map<string, string>();

  for (const alias of aliases ?? []) {
    const normalizedAlias = normalizeText(alias);

    if (normalizedAlias) {
      aliasMap.set(normalizedAlias, alias.trim());
    }
  }

  return Array.from(aliasMap, ([normalizedAlias, alias]) => ({ alias, normalizedAlias }));
}

function calculateEntryNutrition(food: Awaited<ReturnType<typeof nutritionRepository.findFoodById>>, input: CreateMealEntryInput) {
  if (!food) {
    throw new AppError("Food not found", 404);
  }

  const servingSize = Number(food.servingSize);

  if (servingSize <= 0) {
    throw new AppError("Food serving size must be greater than zero", 400);
  }

  const multiplier = input.quantity / servingSize;

  return {
    foodId: food.id,
    foodNameSnapshot: food.name,
    quantity: input.quantity,
    unit: input.unit,
    calories: Math.round(food.calories * multiplier),
    protein: roundMacro(Number(food.protein) * multiplier),
    carbs: roundMacro(Number(food.carbs) * multiplier),
    fat: roundMacro(Number(food.fat) * multiplier),
    fiber: food.fiber != null ? roundMacro(Number(food.fiber) * multiplier) : null,
    sugar: food.sugar != null ? roundMacro(Number(food.sugar) * multiplier) : null
  };
}

function roundMacro(value: number): number {
  return Math.round(value * 100) / 100;
}

function groupMeals(meals: MealResponse[]): Record<MealType, MealResponse | null> {
  const groupedMeals = Object.fromEntries(
    mealTypeOrder.map((mealType) => [mealType, null])
  ) as Record<MealType, MealResponse | null>;

  for (const meal of meals) {
    groupedMeals[meal.mealType] = meal;
  }

  return groupedMeals;
}

export const nutritionService = {
  async searchFoods(query: string): Promise<FoodResponse[]> {
    const normalizedQuery = normalizeText(query);
    const foods = await nutritionRepository.searchFoods(query.trim(), normalizedQuery);

    return foods.map(toFoodResponse);
  },

  async createFood(userId: string, input: CreateFoodInput): Promise<FoodResponse> {
    const normalizedName = normalizeText(input.name);
    const aliases = uniqueAliases(input.aliases);
    const food = await nutritionRepository.createFood(userId, input, normalizedName, aliases);

    return toFoodResponse(food);
  },

  async getMeals(userId: string, date: Date): Promise<MealsResult> {
    const result = await nutritionRepository.getOrCreateDailyLogWithMeals(userId, date);
    const meals = result.meals.map(toMealResponse);

    return {
      dailyTotals: toDailyTotalsResponse(result.dailyLog),
      meals: groupMeals(meals)
    };
  },

  async createMealEntry(userId: string, input: CreateMealEntryInput): Promise<EntryResult> {
    const food = await nutritionRepository.findFoodById(input.foodId);
    const snapshot = calculateEntryNutrition(food, input);
    const result = await nutritionRepository.createFoodEntry(
      userId,
      input.date,
      input.mealType,
      snapshot
    );

    return {
      entry: toFoodEntryResponse(result.entry),
      dailyTotals: toDailyTotalsResponse(result.dailyLog)
    };
  },

  async deleteMealEntry(userId: string, entryId: string): Promise<{ dailyTotals: DailyTotalsResponse }> {
    const result = await nutritionRepository.deleteFoodEntry(userId, entryId);

    if (!result) {
      throw new AppError("Food entry not found", 404);
    }

    return {
      dailyTotals: toDailyTotalsResponse(result.dailyLog)
    };
  }
};
