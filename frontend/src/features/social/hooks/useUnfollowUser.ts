import { useMutation, useQueryClient } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => socialApi.unfollowUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["social", "friends"] });
      void queryClient.invalidateQueries({ queryKey: ["social", "followers"] });
      void queryClient.invalidateQueries({ queryKey: ["social", "search"] });
      void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
