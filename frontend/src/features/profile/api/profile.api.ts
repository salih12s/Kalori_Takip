import { api, type ApiResponse } from "../../../lib/api";
import type {
  CreateGoalPayload,
  GoalResponse,
  ProfileResponse,
  UpdateGoalPayload,
  UpdateProfilePayload,
} from "../types/profile.types";

/** Profile + goals endpoints. Responses unwrap the `{ success, message, data }` envelope. */
export const profileApi = {
  async getMyProfile(): Promise<ProfileResponse> {
    const res = await api.get<ApiResponse<{ profile: ProfileResponse }>>("/profile/me");
    return (res.data as { profile: ProfileResponse }).profile;
  },
  async updateProfile(payload: UpdateProfilePayload): Promise<ProfileResponse> {
    const res = await api.put<ApiResponse<{ profile: ProfileResponse }>>("/profile/me", payload);
    return (res.data as { profile: ProfileResponse }).profile;
  },
  async getMyGoal(): Promise<GoalResponse | null> {
    const res = await api.get<ApiResponse<{ goal: GoalResponse | null }>>("/goals/me");
    return res.data?.goal ?? null;
  },
  async createGoal(payload: CreateGoalPayload): Promise<GoalResponse> {
    const res = await api.post<ApiResponse<{ goal: GoalResponse }>>("/goals", payload);
    return (res.data as { goal: GoalResponse }).goal;
  },
  async updateGoal(goalId: string, payload: UpdateGoalPayload): Promise<GoalResponse> {
    const res = await api.put<ApiResponse<{ goal: GoalResponse }>>(`/goals/${goalId}`, payload);
    return (res.data as { goal: GoalResponse }).goal;
  },
};
