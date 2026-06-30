import type { Server } from "socket.io";

import type {
  FollowRequestReceivedPayload,
  FollowRequestStatusPayload
} from "./realtime.types.js";

let io: Server | null = null;

function userRoom(userId: string): string {
  return `user:${userId}`;
}

export const realtimeService = {
  attach(server: Server) {
    io = server;
  },

  emitFollowRequestReceived(userId: string, payload: FollowRequestReceivedPayload) {
    io?.to(userRoom(userId)).emit("follow:request_received", payload);
  },

  emitFollowRequestAccepted(userId: string, payload: FollowRequestStatusPayload) {
    io?.to(userRoom(userId)).emit("follow:request_accepted", payload);
  },

  emitFollowRequestRejected(userId: string, payload: FollowRequestStatusPayload) {
    io?.to(userRoom(userId)).emit("follow:request_rejected", payload);
  }
};
