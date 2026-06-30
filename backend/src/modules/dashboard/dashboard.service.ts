import type { DailyLog, FoodEntry, Meal } from "@prisma/client";

import { addDays, formatDateOnly, startOfWeek, todayDateOnly } from "../../shared/utils/date.js";
import {
  mapGoal,
  mapMealPreview,
  mapProfile,
  mapTodayDashboard,
  mapWeeklyDashboard,
  mapWeeklyDay
} from "./dashboard.mapper.js";
import { dashboardRepository } from "./dashboard.repository.js";
import type {
  DashboardActivity,
  DashboardGoal,
  DashboardNutrition,
  DashboardStatus,
  TodayDashboardResponse,
  WeeklyDashboardResponse
} from "./dashboard.types.js";

type MealWithEntries = Meal & { entries: FoodEntry[] };
type WeeklyLog = DailyLog & {
  meals: MealWithEntries[];
  activityEntries: unknown[];
};

function percent(value: number, goal: number | null | undefined): number {
  if (!goal || goal <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / goal) * 100));
}

function roundAverage(value: number): number {
  return Math.round(value);
}

function roundTotal(value: number): number {
  return Math.round(value * 100) / 100;
}

function buildNutrition(dailyLog: DailyLog, goal: DashboardGoal | null): DashboardNutrition {
  const totalProtein = Number(dailyLog.totalProtein);
  const totalCarbs = Number(dailyLog.totalCarbs);
  const totalFat = Number(dailyLog.totalFat);

  return {
    totalCalories: dailyLog.totalCalories,
    remainingCalories: goal ? goal.dailyCalorieGoal - dailyLog.totalCalories : null,
    calorieProgress: percent(dailyLog.totalCalories, goal?.dailyCalorieGoal),
    totalProtein: roundTotal(totalProtein),
    totalCarbs: roundTotal(totalCarbs),
    totalFat: roundTotal(totalFat),
    proteinProgress: percent(totalProtein, goal?.dailyProteinGoal),
    carbProgress: percent(totalCarbs, goal?.dailyCarbGoal),
    fatProgress: percent(totalFat, goal?.dailyFatGoal)
  };
}

function buildActivity(dailyLog: DailyLog, goal: DashboardGoal | null): DashboardActivity {
  return {
    totalSteps: dailyLog.totalSteps,
    stepGoal: goal?.dailyStepGoal ?? null,
    stepProgress: percent(dailyLog.totalSteps, goal?.dailyStepGoal),
    totalRunKm: Number(dailyLog.totalRunKm),
    totalWalkKm: Number(dailyLog.totalWalkKm),
    totalWorkoutMinutes: dailyLog.totalWorkoutMinutes,
    totalBurnedCalories: dailyLog.totalBurnedCalories,
    waterMl: dailyLog.waterMl,
    isWorkoutDay: dailyLog.isWorkoutDay,
    isOffDay: dailyLog.isOffDay
  };
}

function buildStatus(dailyLog: DailyLog, goal: DashboardGoal | null, hasLoggedFood: boolean): DashboardStatus {
  const hasReachedCalorieGoal = goal ? dailyLog.totalCalories >= goal.dailyCalorieGoal : false;
  const hasReachedProteinGoal = goal ? Number(dailyLog.totalProtein) >= goal.dailyProteinGoal : false;
  const hasReachedStepGoal = goal ? dailyLog.totalSteps >= goal.dailyStepGoal : false;

  return {
    isCompleted: hasReachedCalorieGoal && hasReachedProteinGoal && hasReachedStepGoal,
    dailyScore: dailyLog.dailyScore,
    hasLoggedFood,
    hasReachedCalorieGoal,
    hasReachedProteinGoal,
    hasReachedStepGoal
  };
}

function hasLoggedDay(log: WeeklyLog): boolean {
  return (
    log.meals.some((meal) => meal.entries.length > 0) ||
    log.activityEntries.length > 0 ||
    Boolean(log.note) ||
    log.totalCalories > 0 ||
    Number(log.totalProtein) > 0 ||
    Number(log.totalCarbs) > 0 ||
    Number(log.totalFat) > 0 ||
    log.totalSteps > 0 ||
    Number(log.totalRunKm) > 0 ||
    Number(log.totalWalkKm) > 0 ||
    log.totalWorkoutMinutes > 0 ||
    log.totalBurnedCalories > 0 ||
    log.waterMl > 0 ||
    log.isWorkoutDay ||
    log.isOffDay
  );
}

export const dashboardService = {
  async getTodayDashboard(userId: string, date?: Date): Promise<TodayDashboardResponse> {
    const dashboardDate = date ?? todayDateOnly();
    const data = await dashboardRepository.getOrCreateTodayData(userId, dashboardDate);
    const goal = mapGoal(data.goal);
    const hasLoggedFood = data.meals.some((meal) => meal.entries.length > 0);

    return mapTodayDashboard({
      date: dashboardDate,
      profile: mapProfile(data.profile),
      goal,
      nutrition: buildNutrition(data.dailyLog, goal),
      activity: buildActivity(data.dailyLog, goal),
      status: buildStatus(data.dailyLog, goal, hasLoggedFood),
      mealsPreview: mapMealPreview(data.meals)
    });
  },

  async getWeeklyDashboard(userId: string, startDate?: Date): Promise<WeeklyDashboardResponse> {
    const weekStart = startDate ?? startOfWeek(todayDateOnly());
    const weekEnd = addDays(weekStart, 6);
    const data = await dashboardRepository.getWeeklyData(userId, weekStart, weekEnd);
    const goal = mapGoal(data.goal);
    const logsByDate = new Map(data.dailyLogs.map((log) => [formatDateOnly(log.date), log as WeeklyLog]));
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      const log = logsByDate.get(formatDateOnly(date));
      const hasFoodEntries = log?.meals.some((meal) => meal.entries.length > 0) ?? false;

      return mapWeeklyDay(log ?? null, date, hasFoodEntries);
    });

    const totalCalories = days.reduce((sum, day) => sum + day.totalCalories, 0);
    const totalProtein = roundTotal(days.reduce((sum, day) => sum + day.totalProtein, 0));
    const totalSteps = days.reduce((sum, day) => sum + day.totalSteps, 0);
    const workoutDays = days.filter((day) => day.isWorkoutDay).length;
    const loggedDays = data.dailyLogs.filter((log) => hasLoggedDay(log as WeeklyLog)).length;

    return mapWeeklyDashboard({
      startDate: formatDateOnly(weekStart),
      endDate: formatDateOnly(weekEnd),
      summary: {
        totalCalories,
        averageCalories: roundAverage(totalCalories / 7),
        totalProtein,
        averageProtein: roundAverage(totalProtein / 7),
        totalSteps,
        averageSteps: roundAverage(totalSteps / 7),
        workoutDays,
        offDays: days.filter((day) => day.isOffDay).length,
        loggedDays,
        totalScore: days.reduce((sum, day) => sum + day.dailyScore, 0)
      },
      goalProgress: {
        calorieGoalDays: goal ? days.filter((day) => day.totalCalories >= goal.dailyCalorieGoal).length : 0,
        proteinGoalDays: goal ? days.filter((day) => day.totalProtein >= goal.dailyProteinGoal).length : 0,
        stepGoalDays: goal ? days.filter((day) => day.totalSteps >= goal.dailyStepGoal).length : 0,
        workoutGoal: goal?.weeklyWorkoutGoal ?? null,
        workoutProgress: percent(workoutDays, goal?.weeklyWorkoutGoal)
      },
      days
    });
  }
};
