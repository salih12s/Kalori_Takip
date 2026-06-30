import type { ActivityEntry, DailyLog, WaterLog, WorkoutSession } from "@prisma/client";

import { formatDateOnly } from "../../shared/utils/date.js";
import type {
  ActivityEntryResponse,
  ActivityTotalsResponse,
  WaterLogResponse,
  WorkoutResponse
} from "./activity.types.js";

export function toActivityTotals(dailyLog: DailyLog): ActivityTotalsResponse {
  return {
    id: dailyLog.id,
    date: formatDateOnly(dailyLog.date),
    totalSteps: dailyLog.totalSteps,
    totalRunKm: Number(dailyLog.totalRunKm),
    totalWalkKm: Number(dailyLog.totalWalkKm),
    totalWorkoutMinutes: dailyLog.totalWorkoutMinutes,
    totalBurnedCalories: dailyLog.totalBurnedCalories,
    waterMl: dailyLog.waterMl,
    isWorkoutDay: dailyLog.isWorkoutDay,
    isOffDay: dailyLog.isOffDay,
    note: dailyLog.note
  };
}

export function toActivityEntry(entry: ActivityEntry): ActivityEntryResponse {
  return {
    id: entry.id,
    activityType: entry.activityType,
    source: entry.source,
    steps: entry.steps,
    distanceKm: Number(entry.distanceKm),
    durationMinutes: entry.durationMinutes,
    caloriesBurned: entry.caloriesBurned,
    note: entry.note,
    createdAt: entry.createdAt
  };
}

export function toWorkout(workout: WorkoutSession): WorkoutResponse {
  return {
    id: workout.id,
    title: workout.title,
    workoutType: workout.workoutType,
    muscleGroups: workout.muscleGroups,
    durationMinutes: workout.durationMinutes,
    caloriesBurned: workout.caloriesBurned,
    intensity: workout.intensity,
    note: workout.note,
    createdAt: workout.createdAt
  };
}

export function toWaterLog(waterLog: WaterLog): WaterLogResponse {
  return {
    id: waterLog.id,
    amountMl: waterLog.amountMl,
    createdAt: waterLog.createdAt
  };
}
