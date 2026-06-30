export type Gender = "MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY";

export type PrivacyLevel = "PUBLIC" | "FRIENDS" | "PRIVATE";

/** Backend GoalType enum (4 values — there is no BUILD_MUSCLE in the schema). */
export type GoalType = "LOSE_WEIGHT" | "MAINTAIN_WEIGHT" | "GAIN_WEIGHT" | "IMPROVE_FITNESS";

export interface ProfileResponse {
  id: string;
  userId: string;
  fullName: string | null;
  bio: string | null;
  gender: Gender | null;
  avatarUrl: string | null;
  heightCm: number | null;
  currentWeightKg: number | null;
  birthDate: string | null;
  goalType: string | null;
  privacyLevel: PrivacyLevel;
  createdAt: string;
  updatedAt: string;
}

export interface GoalResponse {
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
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  bio?: string;
  gender?: Gender;
  birthDate?: string;
  heightCm?: number;
  currentWeightKg?: number;
  privacyLevel?: PrivacyLevel;
}

export interface CreateGoalPayload {
  goalType: GoalType;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbGoal?: number;
  dailyFatGoal?: number;
  dailyStepGoal: number;
  weeklyWorkoutGoal: number;
  targetWeightKg?: number;
}
