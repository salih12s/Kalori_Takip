import { useMutation, useQueryClient } from "@tanstack/react-query";

import { nutritionApi } from "../api/nutrition.api";

export function useDeleteFoodEntry(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: nutritionApi.deleteFoodEntry,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["nutrition", "meals", date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
