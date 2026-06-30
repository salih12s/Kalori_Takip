import { ChallengeMemberStatus, ChallengeStatus, ChallengeType } from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { todayDateOnly } from "../../shared/utils/date.js";
import {
  toChallengeDetailResponse,
  toChallengeListItem,
  toMembershipResponse
} from "./challenges.mapper.js";
import { challengesRepository } from "./challenges.repository.js";
import type { CreateChallengeInput } from "./challenges.types.js";

type RangeLogs = Awaited<ReturnType<typeof challengesRepository.getDailyLogsInRange>>;

/** Progress is computed only from existing DailyLog rows (none are created here). */
function computeProgress(type: ChallengeType, logs: RangeLogs): number {
  switch (type) {
    case ChallengeType.STEPS:
      return logs.reduce((sum, log) => sum + log.totalSteps, 0);
    case ChallengeType.WATER:
      return logs.reduce((sum, log) => sum + log.waterMl, 0);
    case ChallengeType.RUN_DISTANCE:
      return Number(logs.reduce((sum, log) => sum + Number(log.totalRunKm), 0).toFixed(2));
    case ChallengeType.WORKOUT:
      return logs.filter((log) => log.isWorkoutDay).length;
    case ChallengeType.FOOD_LOG:
      return logs.filter((log) => log.totalCalories > 0).length;
    default:
      return 0;
  }
}

function resolveStatus(progress: number, targetValue: number): ChallengeMemberStatus {
  return progress >= targetValue ? ChallengeMemberStatus.COMPLETED : ChallengeMemberStatus.ACTIVE;
}

export const challengesService = {
  async list(userId: string) {
    const challenges = await challengesRepository.listVisible(userId);

    return { challenges: challenges.map(toChallengeListItem) };
  },

  async listMine(userId: string) {
    const challenges = await challengesRepository.listMine(userId);

    return { challenges: challenges.map(toChallengeListItem) };
  },

  async getDetail(userId: string, challengeId: string) {
    const challenge = await challengesRepository.findDetail(challengeId);

    if (!challenge) {
      throw new AppError("Challenge not found", 404);
    }

    const isMember = challenge.members.some((member) => member.userId === userId);

    if (!challenge.isPublic && challenge.creatorId !== userId && !isMember) {
      throw new AppError("Challenge not found", 404);
    }

    return { challenge: toChallengeDetailResponse(challenge, userId) };
  },

  async create(userId: string, input: CreateChallengeInput) {
    const challenge = await challengesRepository.create(userId, input);

    return { challenge: toChallengeListItem(challenge) };
  },

  async join(userId: string, challengeId: string) {
    const challenge = await challengesRepository.findById(challengeId);

    if (!challenge) {
      throw new AppError("Challenge not found", 404);
    }

    if (challenge.status === ChallengeStatus.CANCELLED) {
      throw new AppError("Challenge is cancelled", 400);
    }

    if (challenge.endsAt.getTime() < todayDateOnly().getTime()) {
      throw new AppError("Challenge has ended", 400);
    }

    const existing = await challengesRepository.findMembership(challengeId, userId);

    if (existing) {
      return { membership: toMembershipResponse(existing) };
    }

    const membership = await challengesRepository.createMembership(challengeId, userId);

    return { membership: toMembershipResponse(membership) };
  },

  async leave(userId: string, challengeId: string) {
    const challenge = await challengesRepository.findById(challengeId);

    if (!challenge) {
      throw new AppError("Challenge not found", 404);
    }

    // Creators may leave; the challenge itself is never deleted in the MVP.
    await challengesRepository.deleteMembership(challengeId, userId);

    return { left: true };
  },

  async recalculate(userId: string, challengeId: string) {
    const challenge = await challengesRepository.findById(challengeId);

    if (!challenge) {
      throw new AppError("Challenge not found", 404);
    }

    const membership = await challengesRepository.findMembership(challengeId, userId);

    if (!membership) {
      throw new AppError("You are not a member of this challenge", 400);
    }

    const logs = await challengesRepository.getDailyLogsInRange(
      userId,
      challenge.startsAt,
      challenge.endsAt
    );
    const progress = computeProgress(challenge.type, logs);
    const status = resolveStatus(progress, Number(challenge.targetValue));
    const updated = await challengesRepository.updateMembership(membership.id, progress, status);

    return { membership: toMembershipResponse(updated) };
  },

  async recalculateAll(userId: string) {
    const memberships = await challengesRepository.findActiveMembershipsWithChallenge(userId);
    const results = [];

    for (const membership of memberships) {
      const logs = await challengesRepository.getDailyLogsInRange(
        userId,
        membership.challenge.startsAt,
        membership.challenge.endsAt
      );
      const progress = computeProgress(membership.challenge.type, logs);
      const status = resolveStatus(progress, Number(membership.challenge.targetValue));
      const updated = await challengesRepository.updateMembership(membership.id, progress, status);
      results.push(toMembershipResponse(updated));
    }

    return { memberships: results };
  }
};
