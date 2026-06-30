import { useMutation, useQueryClient } from "@tanstack/react-query";

import { leaderboardApi } from "../api/leaderboard.api";

export function useRecalculateScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leaderboardApi.recalculate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
