import { useMutation, useQueryClient } from "@tanstack/react-query";

import { nutritionApi } from "../api/nutrition.api";

export function useImportExternalFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: nutritionApi.importExternalFood,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["nutrition", "foods"] });
    },
  });
}
