import { useQuery } from "@tanstack/react-query";

import { profileApi } from "../api/profile.api";

export function useMyProfile() {
  return useQuery({
    queryKey: ["profile", "me"],
    queryFn: profileApi.getMyProfile,
  });
}
