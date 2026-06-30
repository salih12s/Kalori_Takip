import { ChallengeMemberStatus, FollowStatus } from "@prisma/client";

import { prisma } from "../../database/prisma.js";
import type { DefaultBadge } from "./gamification.constants.js";

export const gamificationRepository = {
  getActiveBadges() {
    return prisma.badge.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { createdAt: "asc" }]
    });
  },

  getExistingBadgeCodes() {
    return prisma.badge.findMany({ select: { code: true } });
  },

  createBadges(badges: DefaultBadge[]) {
    return prisma.badge.createMany({ data: badges, skipDuplicates: true });
  },

  getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "desc" }
    });
  },

  awardBadges(userId: string, badgeIds: string[]) {
    return prisma.userBadge.createMany({
      data: badgeIds.map((badgeId) => ({ userId, badgeId })),
      skipDuplicates: true
    });
  },

  getStreakLogs(userId: string) {
    return prisma.dailyLog.findMany({
      where: { userId },
      select: {
        date: true,
        totalCalories: true,
        totalProtein: true,
        totalSteps: true,
        totalRunKm: true,
        isWorkoutDay: true,
        isOffDay: true,
        waterMl: true,
        dailyScore: true
      },
      orderBy: { date: "asc" }
    });
  },

  getActiveGoal(userId: string) {
    return prisma.userGoal.findFirst({
      where: { userId, isActive: true },
      orderBy: { createdAt: "desc" }
    });
  },

  countActivityEntries(userId: string) {
    return prisma.activityEntry.count({ where: { userId } });
  },

  countWorkouts(userId: string) {
    return prisma.workoutSession.count({ where: { userId } });
  },

  countWaterLogs(userId: string) {
    return prisma.waterLog.count({ where: { userId } });
  },

  countAcceptedFollows(userId: string) {
    return prisma.follow.count({
      where: {
        status: FollowStatus.ACCEPTED,
        OR: [{ followerId: userId }, { followingId: userId }]
      }
    });
  },

  countCompletedChallenges(userId: string) {
    return prisma.challengeMember.count({
      where: { userId, status: ChallengeMemberStatus.COMPLETED }
    });
  }
};
