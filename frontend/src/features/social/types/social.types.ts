export type FollowStatus = "PENDING" | "ACCEPTED" | "BLOCKED";

export type PrivacyLevel = "PUBLIC" | "FRIENDS" | "PRIVATE";

export interface SafeUserSummary {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  privacyLevel: PrivacyLevel;
  followStatus?: FollowStatus | null;
}

export interface FriendSummary extends SafeUserSummary {
  followedAt: string;
}

export interface FollowResponse {
  id: string;
  followerId: string;
  followingId: string;
  status: FollowStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FollowRequest {
  follow: FollowResponse;
  user: SafeUserSummary;
}

export interface PublicProfile {
  userId: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  privacyLevel: PrivacyLevel;
  /** Stats are only present when the viewer is allowed to see them. */
  todayStepTotal?: number;
  weeklyScore?: number;
  currentStreak?: number;
}
