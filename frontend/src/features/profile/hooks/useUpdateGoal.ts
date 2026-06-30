import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "../api/profile.api";
import type { UpdateGoalPayload } from "../types/profile.types";

interface UpdateGoalVariables {
  goalId: string;
  payload: UpdateGoalPayload;
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, payload }: UpdateGoalVariables) =>
      profileApi.updateGoal(goalId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["goals", "me"] });
      void queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
