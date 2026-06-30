import { api, type ApiResponse } from "../../../lib/api";
import type {
  DailyScoreResponse,
  LeaderboardPeriod,
  LeaderboardPeriodResponse,
  LeaderboardSummary,
} from "../types/leaderboard.types";

/** Leaderboard endpoints. Responses unwrap the `{ success, message, data }` envelope. */
export const leaderboardApi = {
  async getWeekly(startDate?: string): Promise<LeaderboardPeriodResponse> {
    const res = await api.get<ApiResponse<LeaderboardPeriodResponse>>(
      "/leaderboard/weekly",
      startDate ? { startDate } : undefined
    );
    return res.data as LeaderboardPeriodResponse;
  },
  async getMonthly(month?: string): Promise<LeaderboardPeriodResponse> {
    const res = await api.get<ApiResponse<LeaderboardPeriodResponse>>(
      "/leaderboard/monthly",
      month ? { month } : undefined
    );
    return res.data as LeaderboardPeriodResponse;
  },
  async getFriends(period: LeaderboardPeriod): Promise<LeaderboardPeriodResponse> {
    const res = await api.get<ApiResponse<LeaderboardPeriodResponse>>("/leaderboard/friends", {
      period,
    });
    return res.data as LeaderboardPeriodResponse;
  },
  async getMySummary(): Promise<LeaderboardSummary> {
    const res = await api.get<ApiResponse<LeaderboardSummary>>("/leaderboard/me/summary");
    return res.data as LeaderboardSummary;
  },
  async recalculate(): Promise<DailyScoreResponse> {
    const res = await api.post<ApiResponse<DailyScoreResponse>>("/leaderboard/recalculate", {});
    return res.data as DailyScoreResponse;
  },
};
