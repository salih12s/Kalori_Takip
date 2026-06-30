import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "../api/dashboard.api";

export function useWeeklyDashboard(startDate?: string) {
  return useQuery({
    queryKey: ["dashboard", "weekly", startDate ?? "current-week"],
    queryFn: () => dashboardApi.getWeekly(startDate),
  });
}
