export type GoalType = "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT" | "IMPROVE_FITNESS";
export type PrivacyLevel = "PUBLIC" | "FRIENDS" | "PRIVATE";
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface DashboardProfile {
  fullName: string | null;
  avatarUrl: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  privacyLevel: PrivacyLevel;
}

export interface DashboardGoal {
  goalType: GoalType;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal: number | null;
  dailyFatGoal: number | null;
  dailyStepGoal: number;
  weeklyWorkoutGoal: number;
}

export interface DashboardNutrition {
  totalCalories: number;
  remainingCalories: number | null;
  calorieProgress: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  proteinProgress: number;
  carbProgress: number;
  fatProgress: number;
}

export interface DashboardActivity {
  totalSteps: number;
  stepGoal: number | null;
  stepProgress: number;
  totalRunKm: number;
  totalWalkKm: number;
  totalWorkoutMinutes: number;
  totalBurnedCalories: number;
  waterMl: number;
  isWorkoutDay: boolean;
  isOffDay: boolean;
}

export interface DashboardStatus {
  isCompleted: boolean;
  dailyScore: number;
  hasLoggedFood: boolean;
  hasReachedCalorieGoal: boolean;
  hasReachedProteinGoal: boolean;
  hasReachedStepGoal: boolean;
}

export interface MealPreview {
  mealType: MealType;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  entryCount: number;
}

export interface TodayDashboardResponse {
  date: string;
  profile: DashboardProfile | null;
  goal: DashboardGoal | null;
  nutrition: DashboardNutrition;
  activity: DashboardActivity;
  status: DashboardStatus;
  mealsPreview: MealPreview[];
}

export interface WeeklyDaySummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalSteps: number;
  totalBurnedCalories: number;
  waterMl: number;
  isWorkoutDay: boolean;
  isOffDay: boolean;
  dailyScore: number;
  hasFoodEntries: boolean;
}

export interface WeeklyDashboardResponse {
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
}
