export type SafeRealtimeUser = {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export type FollowRequestReceivedPayload = {
  followId: string;
  fromUser: SafeRealtimeUser;
  createdAt: Date;
};

export type FollowRequestStatusPayload = {
  followId: string;
  fromUser: SafeRealtimeUser;
  createdAt: Date;
};
