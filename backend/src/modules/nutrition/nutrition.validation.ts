import { MealType } from "@prisma/client";
import { z } from "zod";

export const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const foodSearchSchema = z.object({
  q: z.string().trim().min(1).max(80)
});

export const createFoodSchema = z
  .object({
    name: z.string().trim().min(1).max(160),
    servingSize: z.number().positive().max(10000),
    servingUnit: z.string().trim().min(1).max(32),
    calories: z.number().int().min(0).max(10000),
    protein: z.number().min(0).max(1000),
    carbs: z.number().min(0).max(1000),
    fat: z.number().min(0).max(1000),
    aliases: z.array(z.string().trim().min(1).max(160)).max(20).optional()
  })
  .strict();

export const getMealsSchema = z.object({
  date: dateOnlySchema
});

export const createMealEntrySchema = z
  .object({
    date: dateOnlySchema,
    mealType: z.nativeEnum(MealType),
    foodId: z.string().uuid(),
    quantity: z.number().positive().max(10000),
    unit: z.string().trim().min(1).max(32)
  })
  .strict();

export const deleteMealEntryParamsSchema = z.object({
  entryId: z.string().uuid()
});
