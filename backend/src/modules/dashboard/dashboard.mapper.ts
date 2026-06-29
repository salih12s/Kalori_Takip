import type { DailyLog, FoodEntry, Meal, Profile, UserGoal } from "@prisma/client";

import { formatDateOnly } from "../../shared/utils/date.js";
import type {
  DashboardActivity,
  DashboardGoal,
  DashboardNutrition,
  DashboardProfile,
  DashboardStatus,
  MealPreview,
  TodayDashboardResponse,
  WeeklyDashboardResponse,
  WeeklyDaySummary
} from "./dashboard.types.js";

type MealWithEntries = Meal & { entries: FoodEntry[] };

export function mapProfile(profile: Profile | null): DashboardProfile | null {
  if (!profile) {
    return null;
  }

  return {
    fullName: profile.fullName,
    avatarUrl: profile.avatarUrl,
    heightCm: profile.heightCm,
    currentWeightKg: profile.currentWeightKg != null ? Number(profile.currentWeightKg) : null,
    privacyLevel: profile.privacyLevel
  };
}

export function mapGoal(goal: UserGoal | null): DashboardGoal | null {
  if (!goal) {
    return null;
  }

  return {
    goalType: goal.goalType,
    dailyCalorieGoal: goal.dailyCalorieGoal,
    dailyProteinGoal: goal.dailyProteinGoal,
    dailyCarbGoal: goal.dailyCarbGoal,
    dailyFatGoal: goal.dailyFatGoal,
    dailyStepGoal: goal.dailyStepGoal,
    weeklyWorkoutGoal: goal.weeklyWorkoutGoal
  };
}

export function mapMealPreview(meals: MealWithEntries[]): MealPreview[] {
  return meals.map((meal) => ({
    mealType: meal.mealType,
    totalCalories: meal.entries.reduce((sum, entry) => sum + entry.calories, 0),
    totalProtein: roundTotal(meal.entries.reduce((sum, entry) => sum + Number(entry.protein), 0)),
    totalCarbs: roundTotal(meal.entries.reduce((sum, entry) => sum + Number(entry.carbs), 0)),
    totalFat: roundTotal(meal.entries.reduce((sum, entry) => sum + Number(entry.fat), 0)),
    entryCount: meal.entries.length
  }));
}

export function mapTodayDashboard(data: {
  date: Date;
  profile: DashboardProfile | null;
  goal: DashboardGoal | null;
  nutrition: DashboardNutrition;
  activity: DashboardActivity;
  status: DashboardStatus;
  mealsPreview: MealPreview[];
}): TodayDashboardResponse {
  return {
    date: formatDateOnly(data.date),
    profile: data.profile,
    goal: data.goal,
    nutrition: data.nutrition,
    activity: data.activity,
    status: data.status,
    mealsPreview: data.mealsPreview
  };
}

export function mapWeeklyDay(dailyLog: DailyLog | null, date: Date, hasFoodEntries: boolean): WeeklyDaySummary {
  return {
    date: formatDateOnly(date),
    totalCalories: dailyLog?.totalCalories ?? 0,
    totalProtein: roundTotal(dailyLog ? Number(dailyLog.totalProtein) : 0),
    totalCarbs: roundTotal(dailyLog ? Number(dailyLog.totalCarbs) : 0),
    totalFat: roundTotal(dailyLog ? Number(dailyLog.totalFat) : 0),
    totalSteps: dailyLog?.totalSteps ?? 0,
    isWorkoutDay: dailyLog?.isWorkoutDay ?? false,
    isOffDay: dailyLog?.isOffDay ?? false,
    dailyScore: dailyLog?.dailyScore ?? 0,
    hasFoodEntries
  };
}

export function mapWeeklyDashboard(data: WeeklyDashboardResponse): WeeklyDashboardResponse {
  return data;
}

function roundTotal(value: number): number {
  return Math.round(value * 100) / 100;
}
