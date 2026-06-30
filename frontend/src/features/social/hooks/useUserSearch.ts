import { useQuery } from "@tanstack/react-query";

import { socialApi } from "../api/social.api";

/** Searches users. Disabled until the (already-debounced) query is non-empty. */
export function useUserSearch(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ["social", "search", trimmed],
    queryFn: () => socialApi.searchUsers(trimmed),
    enabled: trimmed.length > 0,
  });
}
