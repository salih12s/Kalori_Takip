import { useQuery } from "@tanstack/react-query";

import { activityApi } from "../api/activity.api";

export function useDailyActivity(date: string) {
  return useQuery({
    queryKey: ["activity", "daily", date],
    queryFn: () => activityApi.getDaily(date),
  });
}
