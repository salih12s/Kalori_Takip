import { MealType } from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { normalizeText } from "../../shared/utils/normalize-text.js";
import {
  toDailyTotalsResponse,
  toExternalFoodSearchResult,
  toFoodEntryResponse,
  toFoodResponse,
  toLocalFoodSearchResult,
  toMealResponse
} from "./nutrition.mapper.js";
import { nutritionRepository } from "./nutrition.repository.js";
import type {
  CreateFoodInput,
  CreateMealEntryInput,
  DailyTotalsResponse,
  FoodEntryResponse,
  FoodResponse,
  FoodSearchInput,
  FoodSearchResult,
  ImportExternalFoodInput,
  MealResponse
} from "./nutrition.types.js";
import { externalFoodProvider } from "./external/external-food.provider.js";

type MealsResult = {
  dailyTotals: DailyTotalsResponse;
  meals: Record<MealType, MealResponse | null>;
};

type EntryResult = {
  entry: FoodEntryResponse;
  dailyTotals: DailyTotalsResponse;
};
type LocalFood = Awaited<ReturnType<typeof nutritionRepository.searchFoods>>[number];

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

function getSearchScope(source: FoodSearchInput["source"]) {
  if (source === "curated") return "curated";
  if (source === "local") return "cache";
  return "all";
}

function isTestLikeFoodName(name: string): boolean {
  return /^(phase|dashboard)\b/i.test(name) || /\d{8,}/.test(name);
}

function searchRank(food: LocalFood, normalizedQuery: string): number {
  const aliases = food.aliases.map((alias) => alias.normalizedAlias);

  if (food.normalizedName === normalizedQuery) return 0;
  if (aliases.includes(normalizedQuery)) return 1;
  if (food.normalizedName.startsWith(normalizedQuery)) return 2;
  if (aliases.some((alias) => alias.startsWith(normalizedQuery))) return 3;
  if (food.normalizedName.includes(normalizedQuery)) return 4;
  return 5;
}

function sortLocalFoods(foods: LocalFood[], normalizedQuery: string): LocalFood[] {
  return [...foods].sort((first, second) => {
    const firstRank = searchRank(first, normalizedQuery);
    const secondRank = searchRank(second, normalizedQuery);

    if (firstRank !== secondRank) return firstRank - secondRank;
    return first.name.localeCompare(second.name, "tr");
  });
}

export const nutritionService = {
  async searchFoods(input: FoodSearchInput): Promise<FoodSearchResult> {
    const query = input.q.trim();
    const normalizedQuery = normalizeText(query);
    const shouldSearchLocal = input.source !== "external";
    const shouldSearchExternal = input.source === "external" || input.source === "all";
    const [localFoods, externalResult] = await Promise.all([
      shouldSearchLocal
        ? nutritionRepository.searchFoods(query, normalizedQuery, getSearchScope(input.source))
        : Promise.resolve([]),
      shouldSearchExternal ? externalFoodProvider.search(query) : Promise.resolve({ foods: [], failed: false })
    ]);
    const cachedExternalIds = new Set(
      localFoods
        .map((food) => food.externalId)
        .filter((externalId): externalId is string => externalId !== null)
    );
    const externalFoods = externalResult.foods.filter((food) => !cachedExternalIds.has(food.externalId));
    const localResults = sortLocalFoods(
      input.source === "curated" ? localFoods.filter((food) => !isTestLikeFoodName(food.name)) : localFoods,
      normalizedQuery
    ).map(toLocalFoodSearchResult);
    const externalResults = externalFoods.map(toExternalFoodSearchResult);
    const foods =
      input.source === "all"
        ? [...externalResults, ...localResults]
        : input.source === "external"
          ? externalResults
          : localResults;

    return {
      foods: foods.slice(0, 20),
      externalSearchFailed: externalResult.failed
    };
  },

  async createFood(userId: string, input: CreateFoodInput): Promise<FoodResponse> {
    const normalizedName = normalizeText(input.name);
    const aliases = uniqueAliases(input.aliases);
    const food = await nutritionRepository.createFood(userId, input, normalizedName, aliases);

    return toFoodResponse(food);
  },

  async importExternalFood(userId: string, input: ImportExternalFoodInput): Promise<FoodResponse> {
    const existingFood = await nutritionRepository.findImportedFood(input.provider, input.externalId);

    if (existingFood) {
      return toFoodResponse(existingFood);
    }

    const normalizedName = normalizeText(input.name);
    const aliases = uniqueAliases(input.aliases);
    const food = await nutritionRepository.importExternalFood(userId, input, normalizedName, aliases);

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
