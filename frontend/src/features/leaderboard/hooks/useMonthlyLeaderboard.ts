import { useQuery } from "@tanstack/react-query";

import { leaderboardApi } from "../api/leaderboard.api";

export function useMonthlyLeaderboard(month?: string, enabled = true) {
  return useQuery({
    queryKey: ["leaderboard", "monthly", month ?? "current"],
    queryFn: () => leaderboardApi.getMonthly(month),
    enabled,
  });
}
