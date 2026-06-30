import { useQuery } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

export function useFriends() {
  return useQuery({
    queryKey: ["social", "friends"],
    queryFn: socialApi.getFriends,
  });
}
