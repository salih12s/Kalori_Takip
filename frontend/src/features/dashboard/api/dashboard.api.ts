import { api, type ApiResponse } from "../../../lib/api";
import type { TodayDashboardResponse, WeeklyDashboardResponse } from "../types/dashboard.types";

export const dashboardApi = {
  async getToday(date?: string): Promise<TodayDashboardResponse> {
    const res = await api.get<ApiResponse<TodayDashboardResponse>>("/dashboard/today", date ? { date } : undefined);
    return res.data as TodayDashboardResponse;
  },

  async getWeekly(startDate?: string): Promise<WeeklyDashboardResponse> {
    const res = await api.get<ApiResponse<WeeklyDashboardResponse>>(
      "/dashboard/weekly",
      startDate ? { startDate } : undefined
    );
    return res.data as WeeklyDashboardResponse;
  },
};
