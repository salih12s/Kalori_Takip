import { useQuery } from "@tanstack/react-query";

import { gamificationApi } from "../api/gamification.api";

export function useMyBadges() {
  return useQuery({
    queryKey: ["gamification", "my-badges"],
    queryFn: gamificationApi.getMyBadges,
  });
}
