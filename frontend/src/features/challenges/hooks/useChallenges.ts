import { useQuery } from "@tanstack/react-query";

import { challengesApi } from "../api/challenges.api";

export function useChallenges() {
  return useQuery({
    queryKey: ["challenges", "list"],
    queryFn: challengesApi.list,
  });
}
