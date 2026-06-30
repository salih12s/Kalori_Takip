import { useMutation, useQueryClient } from "@tanstack/react-query";

import { activityApi } from "../api/activity.api";

export function useDeleteWaterLog(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: activityApi.deleteWaterLog,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["activity", "daily", date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard", "today", date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
