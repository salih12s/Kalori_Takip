import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "../api/dashboard.api";

export function useTodayDashboard(date?: string) {
  return useQuery({
    queryKey: ["dashboard", "today", date ?? "today"],
    queryFn: () => dashboardApi.getToday(date),
  });
}
