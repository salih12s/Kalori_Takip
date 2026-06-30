export type ActivityType = "STEPS" | "WALK" | "RUN" | "WORKOUT" | "OFF_DAY";
export type ActivitySource = "MANUAL" | "HEALTH_CONNECT" | "HEALTHKIT" | "STRAVA";
export type WorkoutType = "WEIGHT_TRAINING" | "CARDIO" | "MOBILITY" | "SPORT" | "OTHER";

export interface ActivityTotalsResponse {
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
}

export interface ActivityEntryResponse {
  id: string;
  activityType: ActivityType;
  source: ActivitySource;
  steps: number;
  distanceKm: number;
  durationMinutes: number;
  caloriesBurned: number;
  note: string | null;
  createdAt: string;
}

export interface WorkoutResponse {
  id: string;
  title: string;
  workoutType: WorkoutType;
  muscleGroups: string[];
  durationMinutes: number;
  caloriesBurned: number;
  intensity: number | null;
  note: string | null;
  createdAt: string;
}

export interface WaterLogResponse {
  id: string;
  amountMl: number;
  createdAt: string;
}

export interface DailyActivityResponse {
  dailyTotals: ActivityTotalsResponse;
  activities: ActivityEntryResponse[];
  workouts: WorkoutResponse[];
  waterLogs: WaterLogResponse[];
}

export interface CreateActivityPayload {
  date: string;
  activityType: ActivityType;
  steps?: number;
  distanceKm?: number;
  durationMinutes?: number;
  caloriesBurned?: number;
  note?: string;
}

export interface CreateWorkoutPayload {
  date: string;
  title: string;
  workoutType: WorkoutType;
  muscleGroups: string[];
  durationMinutes: number;
  caloriesBurned?: number;
  intensity?: number;
  note?: string;
}

export interface CreateWaterLogPayload {
  date: string;
  amountMl: number;
}

export interface SetOffDayPayload {
  date: string;
  isOffDay: boolean;
  note?: string;
}
