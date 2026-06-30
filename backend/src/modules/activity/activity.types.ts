import type { ActivitySource, ActivityType, WorkoutType } from "@prisma/client";
import type { z } from "zod";

import type {
  createActivitySchema,
  createWaterLogSchema,
  createWorkoutSchema,
  setOffDaySchema
} from "./activity.validation.js";

export type CreateActivityInput = z.infer<typeof createActivitySchema>;
export type SetOffDayInput = z.infer<typeof setOffDaySchema>;
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type CreateWaterLogInput = z.infer<typeof createWaterLogSchema>;

export type ActivityTotalsResponse = {
  id: string;
  date: string;
  totalSteps: number;
  totalRunKm: number;
  totalWalkKm: number;
  totalWorkoutMinutes: number;
  totalBurnedCalories: number;
  waterMl: number;
  isWorkoutDay: boolean;
  isOffDay: boolean;
  note: string | null;
};

export type ActivityEntryResponse = {
  id: string;
  activityType: ActivityType;
  source: ActivitySource;
  steps: number;
  distanceKm: number;
  durationMinutes: number;
  caloriesBurned: number;
  note: string | null;
  createdAt: Date;
};

export type WorkoutResponse = {
  id: string;
  title: string;
  workoutType: WorkoutType;
  muscleGroups: string[];
  durationMinutes: number;
  caloriesBurned: number;
  intensity: number | null;
  note: string | null;
  createdAt: Date;
};

export type WaterLogResponse = {
  id: string;
  amountMl: number;
  createdAt: Date;
};
