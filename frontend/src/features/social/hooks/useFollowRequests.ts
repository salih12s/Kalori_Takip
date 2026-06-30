import { useQuery } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

export function useFollowRequests() {
  return useQuery({
    queryKey: ["social", "requests"],
    queryFn: socialApi.getRequests,
  });
}
