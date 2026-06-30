import { useQuery } from "@tanstack/react-query";

import { leaderboardApi } from "../api/leaderboard.api";

export function useWeeklyLeaderboard(startDate?: string, enabled = true) {
  return useQuery({
    queryKey: ["leaderboard", "weekly", startDate ?? "current"],
    queryFn: () => leaderboardApi.getWeekly(startDate),
    enabled,
  });
}
