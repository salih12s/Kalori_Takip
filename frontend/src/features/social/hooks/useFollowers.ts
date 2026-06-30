import { useQuery } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

export function useFollowers() {
  return useQuery({
    queryKey: ["social", "followers"],
    queryFn: socialApi.getFollowers,
  });
}
