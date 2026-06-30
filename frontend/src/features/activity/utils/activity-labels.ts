import type { ActivityType, WorkoutType } from "../types/activity.types";

export const activityTypeLabels: Record<ActivityType, string> = {
  STEPS: "Adım",
  WALK: "Yürüyüş",
  RUN: "Koşu",
  WORKOUT: "Spor",
  OFF_DAY: "Dinlenme",
};

export const activityTypes: ActivityType[] = ["RUN", "WALK", "STEPS", "WORKOUT"];

export const workoutTypeLabels: Record<WorkoutType, string> = {
  WEIGHT_TRAINING: "Ağırlık",
  CARDIO: "Kardiyo",
  MOBILITY: "Mobilite",
  SPORT: "Spor",
  OTHER: "Diğer",
};

export const workoutTypes: WorkoutType[] = ["WEIGHT_TRAINING", "CARDIO", "MOBILITY", "SPORT", "OTHER"];
