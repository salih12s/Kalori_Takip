import { FollowStatus, LeaderboardPeriod, Prisma } from "@prisma/client";

import { prisma } from "../../database/prisma.js";
import type { PointItem } from "./leaderboard.types.js";

export const leaderboardRepository = {
  getDailyScoringData(userId: string, date: Date) {
    return prisma.$transaction(async (tx) => {
      const dailyLog = await tx.dailyLog.upsert({
        where: { userId_date: { userId, date } },
        update: {},
        create: { userId, date }
      });

      const [fullDailyLog, goal] = await Promise.all([
        tx.dailyLog.findUniqueOrThrow({
          where: { id: dailyLog.id },
          include: {
            meals: { include: { entries: true } },
            activityEntries: true,
            workoutSessions: true,
            waterLogs: true
          }
        }),
        tx.userGoal.findFirst({
          where: { userId, isActive: true },
          orderBy: { createdAt: "desc" }
        })
      ]);

      return { dailyLog: fullDailyLog, goal };
    });
  },

  replaceDailyPoints(userId: string, date: Date, points: PointItem[], dailyScore: number) {
    return prisma.$transaction(async (tx) => {
      await tx.leaderboardPoint.deleteMany({
        where: { userId, period: LeaderboardPeriod.DAILY, periodStart: date }
      });

      if (points.length > 0) {
        await tx.leaderboardPoint.createMany({
          data: points.map((point) => ({
            userId,
            period: LeaderboardPeriod.DAILY,
            source: point.source,
            periodStart: date,
            periodEnd: date,
            score: point.score,
            loggingScore: point.source === "FOOD_LOG" ? point.score : 0,
            goalScore: point.source === "CALORIE_GOAL" ? point.score : 0,
            proteinScore: point.source === "PROTEIN_GOAL" ? point.score : 0,
            stepScore: point.source === "STEP_GOAL" ? point.score : 0,
            workoutScore: point.source === "WORKOUT" ? point.score : 0
          }))
        });
      }

      return tx.dailyLog.upsert({
        where: { userId_date: { userId, date } },
        update: { dailyScore },
        create: { userId, date, dailyScore }
      });
    });
  },

  getDailyPoints(userId: string, date: Date) {
    return prisma.leaderboardPoint.findMany({
      where: { userId, period: LeaderboardPeriod.DAILY, periodStart: date },
      orderBy: { createdAt: "asc" }
    });
  },

  async getVisibleUserIds(userId: string) {
    const follows = await prisma.follow.findMany({
      where: {
        status: FollowStatus.ACCEPTED,
        OR: [{ followerId: userId }, { followingId: userId }]
      },
      select: { followerId: true, followingId: true }
    });

    return [...new Set([userId, ...follows.flatMap((follow) => [follow.followerId, follow.followingId])])];
  },

  getUsers(userIds: string[]) {
    return prisma.user.findMany({
      where: { id: { in: userIds } },
      include: { profile: true }
    });
  },

  getStreakLogs(userId: string) {
    return prisma.dailyLog.findMany({
      where: { userId },
      select: {
        date: true,
        totalCalories: true,
        totalSteps: true,
        isWorkoutDay: true,
        isOffDay: true,
        waterMl: true,
        dailyScore: true
      },
      orderBy: { date: "asc" }
    });
  },

  getDailyLogsForUsers(userIds: string[], startDate: Date, endDate: Date) {
    return prisma.dailyLog.findMany({
      where: {
        userId: { in: userIds },
        date: { gte: startDate, lte: endDate }
      },
      include: {
        meals: { include: { entries: true } },
        activityEntries: true,
        workoutSessions: true,
        waterLogs: true
      },
      orderBy: [{ userId: "asc" }, { date: "asc" }]
    });
  }
};

export type DailyScoringData = Prisma.PromiseReturnType<typeof leaderboardRepository.getDailyScoringData>;
export type LeaderboardDailyLog = Prisma.PromiseReturnType<typeof leaderboardRepository.getDailyLogsForUsers>[number];
