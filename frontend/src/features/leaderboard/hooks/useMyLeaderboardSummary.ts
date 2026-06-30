import { useQuery } from "@tanstack/react-query";

import { leaderboardApi } from "../api/leaderboard.api";

export function useMyLeaderboardSummary() {
  return useQuery({
    queryKey: ["leaderboard", "me", "summary"],
    queryFn: leaderboardApi.getMySummary,
  });
}
