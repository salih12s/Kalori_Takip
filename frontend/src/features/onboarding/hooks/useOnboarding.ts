import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/hooks/useAuth";
import { onboardingApi } from "../api/onboarding.api";

/** Query key for the "does the user have an active goal?" check. */
export const ONBOARDING_STATUS_KEY = ["onboarding-status"] as const;

/**
 * Onboarding completion signal: the active goal (or null).
 * Only runs while authenticated.
 */
export function useOnboardingStatus() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ONBOARDING_STATUS_KEY,
    queryFn: onboardingApi.getActiveGoal,
    enabled: isAuthenticated,
    staleTime: 0,
  });
}

/** Mutations for the two onboarding steps (profile, then goal). */
export function useOnboarding() {
  const queryClient = useQueryClient();

  const profileMutation = useMutation({
    mutationFn: onboardingApi.updateProfile,
  });

  const goalMutation = useMutation({
    mutationFn: onboardingApi.createGoal,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ONBOARDING_STATUS_KEY });
    },
  });

  return { profileMutation, goalMutation };
}
