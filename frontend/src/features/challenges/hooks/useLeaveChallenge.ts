import { useMutation, useQueryClient } from "@tanstack/react-query";

import { challengesApi } from "../api/challenges.api";

export function useLeaveChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) => challengesApi.leave(challengeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
