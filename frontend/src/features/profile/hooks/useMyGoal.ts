import { useQuery } from "@tanstack/react-query";

import { profileApi } from "../api/profile.api";

export function useMyGoal() {
  return useQuery({
    queryKey: ["goals", "me"],
    queryFn: profileApi.getMyGoal,
  });
}
