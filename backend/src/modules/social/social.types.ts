import type { FollowStatus, PrivacyLevel } from "@prisma/client";

export type SafeUserSummary = {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  privacyLevel: PrivacyLevel;
  followStatus?: FollowStatus | null;
};

export type FriendSummary = SafeUserSummary & {
  followedAt: Date;
};

export type FollowResponse = {
  id: string;
  followerId: string;
  followingId: string;
  status: FollowStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicProfileResponse = {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  privacyLevel: PrivacyLevel;
  todayStepTotal?: number;
  weeklyScore?: number;
  currentStreak?: number;
};
