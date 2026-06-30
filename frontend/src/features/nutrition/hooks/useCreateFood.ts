import { useMutation, useQueryClient } from "@tanstack/react-query";

import { nutritionApi } from "../api/nutrition.api";

export function useCreateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: nutritionApi.createFood,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["nutrition", "foods"] });
    },
  });
}
