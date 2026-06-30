import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activityApi } from "../api/activity.api";

export function useAddActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityApi.addActivity,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["activity", "daily", variables.date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "today", variables.date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
