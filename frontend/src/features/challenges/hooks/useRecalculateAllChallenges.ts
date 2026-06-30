import { useMutation, useQueryClient } from "@tanstack/react-query";

import { challengesApi } from "../api/challenges.api";

export function useRecalculateAllChallenges() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: challengesApi.recalculateAll,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
