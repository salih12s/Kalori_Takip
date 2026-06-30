import { api, type ApiResponse } from "../../../lib/api";
import type {
  CreateGoalPayload,
  GoalResponse,
  ProfileResponse,
  UpdateProfilePayload,
} from "../types/onboarding.types";

/** Profile + goals endpoints used by the onboarding flow. */
export const onboardingApi = {
  /** Returns the active goal, or null when onboarding is not complete. */
  async getActiveGoal(): Promise<GoalResponse | null> {
    const res = await api.get<ApiResponse<{ goal: GoalResponse | null }>>("/goals/me");
    return res.data?.goal ?? null;
  },
  async getMyProfile(): Promise<ProfileResponse> {
    const res = await api.get<ApiResponse<{ profile: ProfileResponse }>>("/profile/me");
    return (res.data as { profile: ProfileResponse }).profile;
  },
  async updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponse> {
    const res = await api.put<ApiResponse<{ profile: ProfileResponse }>>("/profile/me", payload);
    return (res.data as { profile: ProfileResponse }).profile;
  },
  async createGoal(payload: CreateGoalPayload): Promise<GoalResponse> {
    const res = await api.post<ApiResponse<{ goal: GoalResponse }>>("/goals", payload);
    return (res.data as { goal: GoalResponse }).goal;
  },
};
