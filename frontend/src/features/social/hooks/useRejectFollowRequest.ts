import { useMutation, useQueryClient } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

export function useRejectFollowRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (followId: string) => socialApi.rejectRequest(followId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["social", "requests"] });
    },
  });
}
