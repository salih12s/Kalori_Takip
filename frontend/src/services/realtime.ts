import { io, type Socket } from "socket.io-client";

import { env } from "../lib/env";

export type FollowRequestEvent = {
  followId: string;
  fromUser: {
    userId: string;
    username: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
  createdAt: string;
};

export function createRealtimeSocket(token: string): Socket {
  return io(env.apiUrl.replace(/\/api$/, ""), {
    auth: { token },
    transports: ["websocket", "polling"],
  });
}
