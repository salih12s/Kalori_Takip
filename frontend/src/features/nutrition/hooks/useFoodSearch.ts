import { useQuery } from "@tanstack/react-query";

import { nutritionApi } from "../api/nutrition.api";
import type { FoodSearchSource } from "../types/nutrition.types";

export function useFoodSearch(query: string, source: FoodSearchSource) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ["nutrition", "foods", trimmedQuery, source],
    queryFn: () => nutritionApi.searchFoods(trimmedQuery, source),
    enabled: trimmedQuery.length >= 2,
  });
}
