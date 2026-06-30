import { ActivityType, WorkoutType } from "@prisma/client";
import { z } from "zod";

import { parseDateOnly } from "../../shared/utils/date.js";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .transform(parseDateOnly);

export const getActivitiesSchema = z.object({
  date: dateOnlySchema
});

export const createActivitySchema = z
  .object({
    date: dateOnlySchema,
    activityType: z.nativeEnum(ActivityType),
    steps: z.number().int().min(0).max(100000).optional(),
    distanceKm: z.number().min(0).max(500).optional(),
    durationMinutes: z.number().int().min(0).max(1440).optional(),
    caloriesBurned: z.number().int().min(0).max(10000).optional(),
    note: z.string().trim().max(500).optional()
  })
  .strict();

export const activityIdParamsSchema = z.object({
  activityId: z.string().uuid()
});

export const setOffDaySchema = z
  .object({
    date: dateOnlySchema,
    isOffDay: z.boolean(),
    note: z.string().trim().max(500).optional()
  })
  .strict();

export const createWorkoutSchema = z
  .object({
    date: dateOnlySchema,
    title: z.string().trim().min(1).max(160),
    workoutType: z.nativeEnum(WorkoutType),
    muscleGroups: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
    durationMinutes: z.number().int().positive().max(1440),
    caloriesBurned: z.number().int().min(0).max(10000).optional(),
    intensity: z.number().int().min(1).max(10).optional(),
    note: z.string().trim().max(500).optional()
  })
  .strict();

export const workoutIdParamsSchema = z.object({
  workoutId: z.string().uuid()
});

export const createWaterLogSchema = z
  .object({
    date: dateOnlySchema,
    amountMl: z.number().int().positive().max(10000)
  })
  .strict();

export const waterLogIdParamsSchema = z.object({
  waterLogId: z.string().uuid()
});
