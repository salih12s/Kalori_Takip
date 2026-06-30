import { useQuery } from "@tanstack/react-query";

import { gamificationApi } from "../api/gamification.api";

export function useBadges() {
  return useQuery({
    queryKey: ["gamification", "badges"],
    queryFn: gamificationApi.getBadges,
  });
}
