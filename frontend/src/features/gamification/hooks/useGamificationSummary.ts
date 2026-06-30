import { useQuery } from "@tanstack/react-query";

import { gamificationApi } from "../api/gamification.api";

export function useGamificationSummary() {
  return useQuery({
    queryKey: ["gamification", "summary"],
    queryFn: gamificationApi.getSummary,
  });
}
