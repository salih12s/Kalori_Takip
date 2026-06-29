import type { GoalType } from "@prisma/client";
import type { z } from "zod";

import type { createGoalSchema, updateGoalSchema } from "./goals.validation.js";

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;

export type GoalResponse = {
  id: string;
  userId: string;
  goalType: GoalType;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal: number | null;
  dailyFatGoal: number | null;
  dailyStepGoal: number;
  weeklyWorkoutGoal: number;
  startingWeightKg: number | null;
  targetWeightKg: number | null;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
