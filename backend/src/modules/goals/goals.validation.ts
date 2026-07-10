import { GoalType } from "@prisma/client";
import { z } from "zod";

const positiveInt = z.number().int().positive();
const weightKg = z.number().positive().min(20).max(400);
const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform((value) => new Date(`${value}T00:00:00.000Z`));

export const createGoalSchema = z
  .object({
    goalType: z.nativeEnum(GoalType),
    dailyCalorieGoal: positiveInt.min(1000).max(6000),
    dailyProteinGoal: positiveInt.min(20).max(400),
    dailyCarbGoal: positiveInt.min(20).max(800).optional(),
    dailyFatGoal: positiveInt.min(10).max(300).optional(),
    dailyStepGoal: positiveInt.min(1000).max(50000),
    weeklyWorkoutGoal: positiveInt.max(14),
    dailyWaterGoal: positiveInt.min(500).max(8000).optional(),
    startingWeightKg: weightKg.optional(),
    targetWeightKg: weightKg.optional(),
    startsAt: dateOnlySchema.optional(),
    endsAt: dateOnlySchema.optional()
  })
  .strict();

export const updateGoalSchema = createGoalSchema
  .partial()
  .extend({
    isActive: z.boolean().optional()
  })
  .strict();
