import { useMutation, useQueryClient } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => socialApi.followUser(userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["social", "search"] });
      void queryClient.invalidateQueries({ queryKey: ["social", "friends"] });
    },
  });
}
