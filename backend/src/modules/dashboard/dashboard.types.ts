import type { GoalType, MealType, PrivacyLevel } from "@prisma/client";

export type DashboardProfile = {
  fullName: string | null;
  avatarUrl: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  privacyLevel: PrivacyLevel;
};

export type DashboardGoal = {
  goalType: GoalType;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal: number | null;
  dailyFatGoal: number | null;
  dailyStepGoal: number;
  weeklyWorkoutGoal: number;
};

export type DashboardNutrition = {
  totalCalories: number;
  remainingCalories: number | null;
  calorieProgress: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  proteinProgress: number;
  carbProgress: number;
  fatProgress: number;
};

export type DashboardActivity = {
  totalSteps: number;
  stepGoal: number | null;
  stepProgress: number;
  totalRunKm: number;
  totalWalkKm: number;
  totalWorkoutMinutes: number;
  isWorkoutDay: boolean;
  isOffDay: boolean;
};

export type DashboardStatus = {
  isCompleted: boolean;
  dailyScore: number;
  hasLoggedFood: boolean;
  hasReachedCalorieGoal: boolean;
  hasReachedProteinGoal: boolean;
  hasReachedStepGoal: boolean;
};

export type MealPreview = {
  mealType: MealType;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entryCount: number;
};

export type TodayDashboardResponse = {
  date: string;
  profile: DashboardProfile | null;
  goal: DashboardGoal | null;
  nutrition: DashboardNutrition;
  activity: DashboardActivity;
  status: DashboardStatus;
  mealsPreview: MealPreview[];
};

export type WeeklyDaySummary = {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSteps: number;
  isWorkoutDay: boolean;
  isOffDay: boolean;
  dailyScore: number;
  hasFoodEntries: boolean;
};

export type WeeklyDashboardResponse = {
  startDate: string;
  endDate: string;
  summary: {
    totalCalories: number;
    averageCalories: number;
    totalProtein: number;
    averageProtein: number;
    totalSteps: number;
    averageSteps: number;
    workoutDays: number;
    offDays: number;
    loggedDays: number;
    totalScore: number;
  };
  goalProgress: {
    calorieGoalDays: number;
    proteinGoalDays: number;
    stepGoalDays: number;
    workoutGoal: number | null;
    workoutProgress: number;
  };
  days: WeeklyDaySummary[];
};
