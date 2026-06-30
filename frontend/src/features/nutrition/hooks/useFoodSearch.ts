import { useQuery } from "@tanstack/react-query";

import { nutritionApi } from "../api/nutrition.api";

export function useFoodSearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: ["nutrition", "foods", trimmedQuery],
    queryFn: () => nutritionApi.searchFoods(trimmedQuery),
    enabled: trimmedQuery.length >= 2,
  });
}
