import { FollowStatus, PrivacyLevel } from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { realtimeService } from "../../realtime/realtime.service.js";
import { startOfWeek, todayDateOnly } from "../../shared/utils/date.js";
import { computeStreaks, type StreakSignalLog } from "../../shared/utils/streak.js";
import {
  toFollowResponse,
  toFriendSummary,
  toLimitedProfile,
  toPublicProfile,
  toSafeUserSummary
} from "./social.mapper.js";
import { socialRepository } from "./social.repository.js";

export const socialService = {
  async searchUsers(currentUserId: string, query: string) {
    const users = await socialRepository.searchUsers(currentUserId, query);
    const follows = await socialRepository.findFollowsFromUser(
      currentUserId,
      users.map((user) => user.id)
    );
    const followByTargetId = new Map(follows.map((follow) => [follow.followingId, follow]));

    return {
      users: users.map((user) => toSafeUserSummary(user, followByTargetId.get(user.id)))
    };
  },

  async followUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new AppError("You cannot follow yourself", 400);
    }

    const targetUser = await socialRepository.findUserById(targetUserId);

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    const existingFollow = await socialRepository.findFollow(currentUserId, targetUserId);

    if (existingFollow) {
      return { follow: toFollowResponse(existingFollow) };
    }

    const currentUser = await socialRepository.findUserById(currentUserId);

    if (!currentUser) {
      throw new AppError("User not found", 404);
    }

    const follow = await socialRepository.createPendingFollow(currentUserId, targetUserId);
    realtimeService.emitFollowRequestReceived(targetUserId, {
      followId: follow.id,
      fromUser: {
        userId: currentUser.id,
        username: currentUser.username,
        fullName: currentUser.profile?.fullName ?? null,
        avatarUrl: currentUser.profile?.avatarUrl ?? null
      },
      createdAt: follow.createdAt
    });

    return { follow: toFollowResponse(follow) };
  },

  async unfollowUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new AppError("You cannot unfollow yourself", 400);
    }

    await socialRepository.deleteFollow(currentUserId, targetUserId);

    return { unfollowed: true };
  },

  async getFriends(currentUserId: string) {
    const follows = await socialRepository.getAcceptedFollowing(currentUserId);

    return {
      friends: follows.map((follow) => toFriendSummary(follow.following, follow))
    };
  },

  async getFollowers(currentUserId: string) {
    const follows = await socialRepository.getFollowers(currentUserId);

    return {
      followers: follows.map((follow) => toFriendSummary(follow.follower, follow))
    };
  },

  async getRequests(currentUserId: string) {
    const requests = await socialRepository.getPendingRequests(currentUserId);

    return {
      requests: requests.map((follow) => ({
        follow: toFollowResponse(follow),
        user: toSafeUserSummary(follow.follower, follow)
      }))
    };
  },

  async acceptRequest(currentUserId: string, followId: string) {
    const follow = await socialRepository.findFollowById(followId);

    if (!follow || follow.followingId !== currentUserId || follow.status !== FollowStatus.PENDING) {
      throw new AppError("Follow request not found", 404);
    }

    const acceptedFollow = await socialRepository.acceptFollow(followId);
    const currentUser = await socialRepository.findUserById(currentUserId);

    if (currentUser) {
      realtimeService.emitFollowRequestAccepted(follow.followerId, {
        followId: follow.id,
        fromUser: {
          userId: currentUser.id,
          username: currentUser.username,
          fullName: currentUser.profile?.fullName ?? null,
          avatarUrl: currentUser.profile?.avatarUrl ?? null
        },
        createdAt: acceptedFollow.updatedAt
      });
    }

    return { follow: toFollowResponse(acceptedFollow) };
  },

  async rejectRequest(currentUserId: string, followId: string) {
    const follow = await socialRepository.findFollowById(followId);

    if (!follow || follow.followingId !== currentUserId || follow.status !== FollowStatus.PENDING) {
      throw new AppError("Follow request not found", 404);
    }

    await socialRepository.rejectFollow(followId);
    const currentUser = await socialRepository.findUserById(currentUserId);

    if (currentUser) {
      realtimeService.emitFollowRequestRejected(follow.followerId, {
        followId: follow.id,
        fromUser: {
          userId: currentUser.id,
          username: currentUser.username,
          fullName: currentUser.profile?.fullName ?? null,
          avatarUrl: currentUser.profile?.avatarUrl ?? null
        },
        createdAt: new Date()
      });
    }

    return { rejected: true };
  },

  async getPublicProfile(currentUserId: string, targetUserId: string) {
    const targetUser = await socialRepository.findUserById(targetUserId);

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    const privacyLevel = targetUser.profile?.privacyLevel ?? PrivacyLevel.FRIENDS;
    const isSelf = currentUserId === targetUserId;
    const acceptedFollow = await socialRepository.findFollow(currentUserId, targetUserId);
    const canViewStats =
      isSelf ||
      privacyLevel === PrivacyLevel.PUBLIC ||
      (privacyLevel === PrivacyLevel.FRIENDS && acceptedFollow?.status === FollowStatus.ACCEPTED);

    if (privacyLevel === PrivacyLevel.PRIVATE && !isSelf) {
      return { profile: toLimitedProfile(targetUser) };
    }

    if (privacyLevel === PrivacyLevel.FRIENDS && !canViewStats) {
      return { profile: toLimitedProfile(targetUser) };
    }

    const today = todayDateOnly();
    const [dailyLog, weeklyPoint, streakLogs] = await Promise.all([
      socialRepository.getTodayStats(targetUserId, today),
      socialRepository.getWeeklyScore(targetUserId, startOfWeek(today)),
      socialRepository.getStreakLogs(targetUserId)
    ]);
    const { currentStreak } = computeStreaks(streakLogs as StreakSignalLog[]);

    return {
      profile: toPublicProfile(targetUser, {
        todayStepTotal: dailyLog?.totalSteps ?? 0,
        weeklyScore: weeklyPoint?.score ?? 0,
        currentStreak
      })
    };
  }
};
