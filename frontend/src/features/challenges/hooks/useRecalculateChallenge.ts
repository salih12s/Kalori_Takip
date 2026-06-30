import { useMutation, useQueryClient } from "@tanstack/react-query";

import { challengesApi } from "../api/challenges.api";

export function useRecalculateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) => challengesApi.recalculate(challengeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
