import { useMutation, useQueryClient } from "@tanstack/react-query";

import { challengesApi } from "../api/challenges.api";

export function useJoinChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (challengeId: string) => challengesApi.join(challengeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
