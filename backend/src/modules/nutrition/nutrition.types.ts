import type { FoodSource, MealType } from "@prisma/client";
import type { z } from "zod";

import type {
  createFoodSchema,
  createMealEntrySchema,
  foodSearchSchema,
  getMealsSchema
} from "./nutrition.validation.js";

export type FoodSearchInput = z.infer<typeof foodSearchSchema>;
export type CreateFoodInput = z.infer<typeof createFoodSchema>;
export type GetMealsInput = z.infer<typeof getMealsSchema>;
export type CreateMealEntryInput = z.infer<typeof createMealEntrySchema>;

export type FoodResponse = {
  id: string;
  userId: string | null;
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: FoodSource;
  aliases: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type FoodEntryResponse = {
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
  createdAt: Date;
  updatedAt: Date;
};

export type MealResponse = {
  id: string;
  mealType: MealType;
  date: Date;
  entries: FoodEntryResponse[];
};

export type DailyTotalsResponse = {
  id: string;
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};
