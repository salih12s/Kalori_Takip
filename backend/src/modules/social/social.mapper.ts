import type { Follow, Profile, User } from "@prisma/client";

import type { FollowResponse, FriendSummary, PublicProfileResponse, SafeUserSummary } from "./social.types.js";

type UserWithProfile = Pick<User, "id" | "username"> & { profile: Profile | null };

export function toSafeUserSummary(user: UserWithProfile, follow?: Follow | null): SafeUserSummary {
  return {
    userId: user.id,
    username: user.username,
    fullName: user.profile?.fullName ?? null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    privacyLevel: user.profile?.privacyLevel ?? "FRIENDS",
    followStatus: follow?.status ?? null
  };
}

export function toFriendSummary(user: UserWithProfile, follow: Follow): FriendSummary {
  return {
    ...toSafeUserSummary(user),
    followedAt: follow.updatedAt
  };
}

export function toFollowResponse(follow: Follow): FollowResponse {
  return {
    id: follow.id,
    followerId: follow.followerId,
    followingId: follow.followingId,
    status: follow.status,
    createdAt: follow.createdAt,
    updatedAt: follow.updatedAt
  };
}

export function toPublicProfile(user: UserWithProfile, stats?: { todayStepTotal: number; weeklyScore: number }): PublicProfileResponse {
  return {
    userId: user.id,
    username: user.username,
    fullName: user.profile?.fullName ?? null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    privacyLevel: user.profile?.privacyLevel ?? "FRIENDS",
    ...(stats ? { ...stats, currentStreak: 0 } : {})
  };
}

export function toLimitedProfile(user: UserWithProfile): PublicProfileResponse {
  return {
    userId: user.id,
    username: user.username,
    fullName: null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    privacyLevel: user.profile?.privacyLevel ?? "FRIENDS"
  };
}
