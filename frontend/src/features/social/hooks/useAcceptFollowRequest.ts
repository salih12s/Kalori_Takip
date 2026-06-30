import { useMutation, useQueryClient } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

export function useAcceptFollowRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followId: string) => socialApi.acceptRequest(followId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["social", "requests"] });
      void queryClient.invalidateQueries({ queryKey: ["social", "followers"] });
      void queryClient.invalidateQueries({ queryKey: ["social", "friends"] });
      void queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
