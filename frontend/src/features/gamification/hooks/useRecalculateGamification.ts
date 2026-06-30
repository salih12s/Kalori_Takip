import { useMutation, useQueryClient } from "@tanstack/react-query";

import { gamificationApi } from "../api/gamification.api";

export function useRecalculateGamification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: gamificationApi.recalculate,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["gamification"] });
      void queryClient.invalidateQueries({ queryKey: ["leaderboard", "me", "summary"] });
      void queryClient.invalidateQueries({ queryKey: ["social", "public-profile"] });
    },
  });
}
