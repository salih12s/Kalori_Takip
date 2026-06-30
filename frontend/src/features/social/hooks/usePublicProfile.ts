import { useQuery } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

/** Loads a user's safe public profile. Pass null to keep the query disabled. */
export function usePublicProfile(userId: string | null) {
  return useQuery({
    queryKey: ["social", "public-profile", userId],
    queryFn: () => socialApi.getPublicProfile(userId as string),
    enabled: Boolean(userId),
  });
}
