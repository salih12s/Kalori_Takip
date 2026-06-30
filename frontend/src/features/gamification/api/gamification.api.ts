import { api, type ApiResponse } from "../../../lib/api";
import type {
  BadgeWithEarned,
  EarnedBadge,
  GamificationSummary,
  RecalculateResult,
} from "../types/gamification.types";

/** Gamification endpoints. Responses unwrap the `{ success, message, data }` envelope. */
export const gamificationApi = {
  async getSummary(): Promise<GamificationSummary> {
    const res = await api.get<ApiResponse<{ summary: GamificationSummary }>>(
      "/gamification/me/summary"
    );
    return (res.data as { summary: GamificationSummary }).summary;
  },
  async getBadges(): Promise<BadgeWithEarned[]> {
    const res = await api.get<ApiResponse<{ badges: BadgeWithEarned[] }>>("/gamification/badges");
    return res.data?.badges ?? [];
  },
  async getMyBadges(): Promise<EarnedBadge[]> {
    const res = await api.get<ApiResponse<{ badges: EarnedBadge[] }>>("/gamification/me/badges");
    return res.data?.badges ?? [];
  },
  async recalculate(): Promise<RecalculateResult> {
    const res = await api.post<ApiResponse<RecalculateResult>>("/gamification/recalculate", {});
    return res.data as RecalculateResult;
  },
};
