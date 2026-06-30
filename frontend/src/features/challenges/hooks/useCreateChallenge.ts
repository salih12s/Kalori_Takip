import { useMutation, useQueryClient } from "@tanstack/react-query";

import { challengesApi } from "../api/challenges.api";

export function useCreateChallenge() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: challengesApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
}
