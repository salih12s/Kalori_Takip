import { useQuery } from "@tanstack/react-query";

import { leaderboardApi } from "../api/leaderboard.api";
import type { LeaderboardPeriod } from "../types/leaderboard.types";

export function useFriendsLeaderboard(period: LeaderboardPeriod = "weekly", enabled = true) {
  return useQuery({
    queryKey: ["leaderboard", "friends", period],
    queryFn: () => leaderboardApi.getFriends(period),
    enabled,
  });
}
