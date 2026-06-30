import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "../api/profile.api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
    },
  });
}
