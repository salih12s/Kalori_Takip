import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "../api/profile.api";

/** Invalidate every cache that depends on the active goal. */
function invalidateGoalDependents(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ["goals", "me"] });
  void queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
  void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.createGoal,
    onSuccess: () => invalidateGoalDependents(queryClient),
  });
}
