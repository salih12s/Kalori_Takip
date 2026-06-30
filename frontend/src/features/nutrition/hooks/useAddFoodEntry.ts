import { useMutation, useQueryClient } from "@tanstack/react-query";

import { nutritionApi } from "../api/nutrition.api";

export function useAddFoodEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: nutritionApi.addFoodEntry,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["nutrition", "meals", variables.date] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
