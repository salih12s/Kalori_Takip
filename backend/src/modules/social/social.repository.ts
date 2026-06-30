import { FollowStatus } from "@prisma/client";

import { prisma } from "../../database/prisma.js";

export const socialRepository = {
  searchUsers(currentUserId: string, query: string) {
    return prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { profile: { fullName: { contains: query, mode: "insensitive" } } }
        ]
      },
      include: { profile: true },
      orderBy: { username: "asc" },
      take: 20
    });
  },

  findFollowsFromUser(currentUserId: string, targetUserIds: string[]) {
    return prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: { in: targetUserIds }
      }
    });
  },

  findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });
  },

  findFollow(followerId: string, followingId: string) {
    return prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });
  },

  createPendingFollow(followerId: string, followingId: string) {
    return prisma.follow.create({
      data: {
        followerId,
        followingId,
        status: FollowStatus.PENDING
      }
    });
  },

  deleteFollow(followerId: string, followingId: string) {
    return prisma.follow.deleteMany({
      where: { followerId, followingId }
    });
  },

  getAcceptedFollowing(userId: string) {
    return prisma.follow.findMany({
      where: { followerId: userId, status: FollowStatus.ACCEPTED },
      include: { following: { include: { profile: true } } },
      orderBy: { updatedAt: "desc" }
    });
  },

  getFollowers(userId: string) {
    return prisma.follow.findMany({
      where: { followingId: userId, status: FollowStatus.ACCEPTED },
      include: { follower: { include: { profile: true } } },
      orderBy: { updatedAt: "desc" }
    });
  },

  getPendingRequests(userId: string) {
    return prisma.follow.findMany({
      where: { followingId: userId, status: FollowStatus.PENDING },
      include: { follower: { include: { profile: true } } },
      orderBy: { createdAt: "desc" }
    });
  },

  findFollowById(followId: string) {
    return prisma.follow.findUnique({
      where: { id: followId }
    });
  },

  acceptFollow(followId: string) {
    return prisma.follow.update({
      where: { id: followId },
      data: { status: FollowStatus.ACCEPTED }
    });
  },

  rejectFollow(followId: string) {
    return prisma.follow.delete({
      where: { id: followId }
    });
  },

  getTodayStats(userId: string, date: Date) {
    return prisma.dailyLog.findUnique({
      where: { userId_date: { userId, date } }
    });
  },

  getWeeklyScore(userId: string, startDate: Date) {
    return prisma.leaderboardPoint.findFirst({
      where: { userId, period: "WEEKLY", periodStart: startDate }
    });
  }
};
