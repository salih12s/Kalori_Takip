import { useQuery } from "@tanstack/react-query";

import { challengesApi } from "../api/challenges.api";

export function useMyChallenges() {
  return useQuery({
    queryKey: ["challenges", "mine"],
    queryFn: challengesApi.listMine,
  });
}
