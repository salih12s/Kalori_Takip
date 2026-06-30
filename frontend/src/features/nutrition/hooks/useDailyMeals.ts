import { useQuery } from "@tanstack/react-query";

import { nutritionApi } from "../api/nutrition.api";

export function useDailyMeals(date: string) {
  return useQuery({
    queryKey: ["nutrition", "meals", date],
    queryFn: () => nutritionApi.getMeals(date),
  });
}
