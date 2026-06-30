import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activityApi } from "../api/activity.api";

export function useDeleteActivity(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityApi.deleteActivity,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activity", "daily", date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "today", date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
