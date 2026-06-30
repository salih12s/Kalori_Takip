import { ChallengeStatus, type ChallengeMemberStatus } from "@prisma/client";

import { prisma } from "../../database/prisma.js";
import type { CreateChallengeInput } from "./challenges.types.js";

const mineInclude = (userId: string) => ({
  _count: { select: { members: true } },
  members: { where: { userId } }
});

export const challengesRepository = {
  listVisible(userId: string) {
    return prisma.challenge.findMany({
      where: {
        OR: [
          { isPublic: true, status: ChallengeStatus.ACTIVE },
          { creatorId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: mineInclude(userId),
      orderBy: { createdAt: "desc" }
    });
  },

  listMine(userId: string) {
    return prisma.challenge.findMany({
      where: {
        OR: [{ creatorId: userId }, { members: { some: { userId } } }]
      },
      include: mineInclude(userId),
      orderBy: { createdAt: "desc" }
    });
  },

  findById(challengeId: string) {
    return prisma.challenge.findUnique({ where: { id: challengeId } });
  },

  findDetail(challengeId: string) {
    return prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        _count: { select: { members: true } },
        members: {
          include: { user: { include: { profile: true } } },
          orderBy: { progress: "desc" }
        }
      }
    });
  },

  create(creatorId: string, data: CreateChallengeInput) {
    return prisma.$transaction(async (tx) => {
      const challenge = await tx.challenge.create({
        data: {
          creatorId,
          title: data.title,
          description: data.description ?? null,
          type: data.type,
          targetValue: data.targetValue,
          unit: data.unit,
          startsAt: data.startsAt,
          endsAt: data.endsAt,
          isPublic: data.isPublic
        }
      });

      await tx.challengeMember.create({
        data: { challengeId: challenge.id, userId: creatorId }
      });

      return tx.challenge.findUniqueOrThrow({
        where: { id: challenge.id },
        include: mineInclude(creatorId)
      });
    });
  },

  findMembership(challengeId: string, userId: string) {
    return prisma.challengeMember.findUnique({
      where: { challengeId_userId: { challengeId, userId } }
    });
  },

  createMembership(challengeId: string, userId: string) {
    return prisma.challengeMember.create({ data: { challengeId, userId } });
  },

  deleteMembership(challengeId: string, userId: string) {
    return prisma.challengeMember.deleteMany({ where: { challengeId, userId } });
  },

  updateMembership(memberId: string, progress: number, status: ChallengeMemberStatus) {
    return prisma.challengeMember.update({
      where: { id: memberId },
      data: { progress, status }
    });
  },

  findActiveMembershipsWithChallenge(userId: string) {
    return prisma.challengeMember.findMany({
      where: { userId, challenge: { status: ChallengeStatus.ACTIVE } },
      include: { challenge: true }
    });
  },

  getDailyLogsInRange(userId: string, startDate: Date, endDate: Date) {
    return prisma.dailyLog.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      select: {
        totalSteps: true,
        totalRunKm: true,
        waterMl: true,
        isWorkoutDay: true,
        totalCalories: true
      }
    });
  }
};
