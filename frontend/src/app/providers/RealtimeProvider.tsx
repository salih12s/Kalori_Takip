import { useQueryClient } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";
import { toast } from "sonner";

import { useAuth } from "../../features/auth/hooks/useAuth";
import { createRealtimeSocket, type FollowRequestEvent } from "../../services/realtime";

interface RealtimeProviderProps {
  children: ReactNode;
}

const socialQueryKeys = [
  ["social", "requests"],
  ["social", "friends"],
  ["social", "followers"],
];

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const { token, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const socket = createRealtimeSocket(token);
    const refreshSocialQueries = () => {
      for (const queryKey of socialQueryKeys) {
        void queryClient.invalidateQueries({ queryKey });
      }
    };
    const handleRequestReceived = (payload: FollowRequestEvent) => {
      toast.info("Yeni takip isteği aldın.", {
        description: payload.fromUser.fullName ?? payload.fromUser.username,
      });
      refreshSocialQueries();
    };
    const handleRequestAccepted = () => {
      toast.success("Takip isteğin kabul edildi.");
      refreshSocialQueries();
    };
    const handleRequestRejected = () => {
      toast.message("Takip isteğin reddedildi.");
      refreshSocialQueries();
    };

    socket.on("follow:request_received", handleRequestReceived);
    socket.on("follow:request_accepted", handleRequestAccepted);
    socket.on("follow:request_rejected", handleRequestRejected);

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, queryClient, token]);

  return children;
}
