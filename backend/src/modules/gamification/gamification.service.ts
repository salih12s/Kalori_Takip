import { BadgeTriggerType, type Badge, type BadgeCategory } from "@prisma/client";

import { formatDateOnly, startOfWeek, todayDateOnly } from "../../shared/utils/date.js";
import {
  computeStreaks,
  countActiveDaysInRange,
  type StreakSignalLog
} from "../../shared/utils/streak.js";
import { DEFAULT_BADGES } from "./gamification.constants.js";
import { toBadgeBase, toBadgeWithEarned, toEarnedBadge } from "./gamification.mapper.js";
import { gamificationRepository } from "./gamification.repository.js";
import type { GamificationSummary } from "./gamification.types.js";

type StreakLog = Awaited<ReturnType<typeof gamificationRepository.getStreakLogs>>[number];
type EarnedUserBadge = Awaited<ReturnType<typeof gamificationRepository.getUserBadges>>[number];

type Context = {
  hasFood: boolean;
  hasActivity: boolean;
  hasWorkout: boolean;
  hasWater: boolean;
  hasFriend: boolean;
  hasCompletedChallenge: boolean;
  calorieGoalDay: boolean;
  proteinGoalDay: boolean;
  maxSteps: number;
  maxRunKm: number;
  maxDailyScore: number;
  currentStreak: number;
  longestStreak: number;
  activeDaysThisWeek: number;
  todayScore: number;
  weeklyScore: number;
};

function timeOf(date: Date): number {
  return new Date(`${formatDateOnly(date)}T00:00:00.000Z`).getTime();
}

async function ensureDefaultBadges(): Promise<void> {
  const existing = await gamificationRepository.getExistingBadgeCodes();
  const existingCodes = new Set(existing.map((badge) => badge.code));
  const missing = DEFAULT_BADGES.filter((badge) => !existingCodes.has(badge.code));

  if (missing.length > 0) {
    await gamificationRepository.createBadges(missing);
  }
}

async function buildContext(userId: string): Promise<Context> {
  const [logs, goal, activityCount, workoutCount, waterCount, friendCount, completedChallengeCount] =
    await Promise.all([
      gamificationRepository.getStreakLogs(userId),
      gamificationRepository.getActiveGoal(userId),
      gamificationRepository.countActivityEntries(userId),
      gamificationRepository.countWorkouts(userId),
      gamificationRepository.countWaterLogs(userId),
      gamificationRepository.countAcceptedFollows(userId),
      gamificationRepository.countCompletedChallenges(userId)
    ]);

  const { currentStreak, longestStreak, activeDates } = computeStreaks(logs as StreakSignalLog[]);
  const today = todayDateOnly();
  const weekStart = startOfWeek(today);
  const weekStartTime = weekStart.getTime();
  const todayTime = today.getTime();

  const todayLog = logs.find((log) => formatDateOnly(log.date) === formatDateOnly(today));
  const weeklyScore = logs
    .filter((log) => timeOf(log.date) >= weekStartTime && timeOf(log.date) <= todayTime)
    .reduce((sum, log) => sum + log.dailyScore, 0);

  let calorieGoalDay = false;
  let proteinGoalDay = false;
  if (goal) {
    const minCalories = Math.ceil(goal.dailyCalorieGoal * 0.8);
    const maxCalories = Math.floor(goal.dailyCalorieGoal * 1.1);
    calorieGoalDay = logs.some(
      (log) => log.totalCalories >= minCalories && log.totalCalories <= maxCalories
    );
    proteinGoalDay = logs.some((log) => Number(log.totalProtein) >= goal.dailyProteinGoal);
  }

  return {
    hasFood: logs.some((log) => log.totalCalories > 0),
    hasActivity: activityCount > 0 || logs.some((log) => log.totalSteps > 0),
    hasWorkout: workoutCount > 0 || logs.some((log) => log.isWorkoutDay),
    hasWater: waterCount > 0 || logs.some((log) => log.waterMl > 0),
    hasFriend: friendCount > 0,
    hasCompletedChallenge: completedChallengeCount > 0,
    calorieGoalDay,
    proteinGoalDay,
    maxSteps: logs.reduce((max, log) => Math.max(max, log.totalSteps), 0),
    maxRunKm: logs.reduce((max, log) => Math.max(max, Number(log.totalRunKm)), 0),
    maxDailyScore: logs.reduce((max, log) => Math.max(max, log.dailyScore), 0),
    currentStreak,
    longestStreak,
    activeDaysThisWeek: countActiveDaysInRange(activeDates, weekStart, today),
    todayScore: todayLog?.dailyScore ?? 0,
    weeklyScore
  };
}

function isBadgeEarned(badge: Badge, context: Context): boolean {
  switch (badge.triggerType) {
    case BadgeTriggerType.FIRST_FOOD_LOG:
      return context.hasFood;
    case BadgeTriggerType.FIRST_ACTIVITY:
      return context.hasActivity;
    case BadgeTriggerType.FIRST_WORKOUT:
      return context.hasWorkout;
    case BadgeTriggerType.FIRST_WATER:
      return context.hasWater;
    case BadgeTriggerType.STEP_DAY:
      return context.maxSteps >= (badge.triggerValue ?? 10000);
    case BadgeTriggerType.RUN_DISTANCE_DAY:
      return context.maxRunKm >= (badge.triggerValue ?? 5);
    case BadgeTriggerType.CALORIE_GOAL_DAY:
      return context.calorieGoalDay;
    case BadgeTriggerType.PROTEIN_GOAL_DAY:
      return context.proteinGoalDay;
    case BadgeTriggerType.STREAK_DAYS:
      return context.longestStreak >= (badge.triggerValue ?? 0);
    case BadgeTriggerType.DAILY_SCORE:
      return context.maxDailyScore >= (badge.triggerValue ?? 0);
    case BadgeTriggerType.CHALLENGE_COMPLETED:
      return context.hasCompletedChallenge;
    case BadgeTriggerType.FIRST_FRIEND:
      return context.hasFriend;
    default:
      return false;
  }
}

function buildSummary(
  context: Context,
  badges: Badge[],
  earned: EarnedUserBadge[]
): GamificationSummary {
  const earnedBadgeIds = new Set(earned.map((userBadge) => userBadge.badgeId));
  const byCategory = new Map<BadgeCategory, { earned: number; total: number }>();

  for (const badge of badges) {
    const entry = byCategory.get(badge.category) ?? { earned: 0, total: 0 };
    entry.total += 1;
    if (earnedBadgeIds.has(badge.id)) {
      entry.earned += 1;
    }
    byCategory.set(badge.category, entry);
  }

  return {
    currentStreak: context.currentStreak,
    longestStreak: context.longestStreak,
    activeDaysThisWeek: context.activeDaysThisWeek,
    totalEarnedBadges: earned.length,
    totalAvailableBadges: badges.length,
    recentBadges: earned.slice(0, 5).map(toEarnedBadge),
    badgesByCategory: [...byCategory.entries()].map(([category, value]) => ({
      category,
      earned: value.earned,
      total: value.total
    })),
    todayScore: context.todayScore,
    weeklyScore: context.weeklyScore
  };
}

export const gamificationService = {
  async getBadges(userId: string) {
    await ensureDefaultBadges();
    const [badges, userBadges] = await Promise.all([
      gamificationRepository.getActiveBadges(),
      gamificationRepository.getUserBadges(userId)
    ]);
    const earnedMap = new Map(userBadges.map((userBadge) => [userBadge.badgeId, userBadge]));

    return { badges: badges.map((badge) => toBadgeWithEarned(badge, earnedMap.get(badge.id))) };
  },

  async getMyBadges(userId: string) {
    await ensureDefaultBadges();
    const userBadges = await gamificationRepository.getUserBadges(userId);

    return { badges: userBadges.map(toEarnedBadge) };
  },

  async getSummary(userId: string) {
    await ensureDefaultBadges();
    const [context, badges, earned] = await Promise.all([
      buildContext(userId),
      gamificationRepository.getActiveBadges(),
      gamificationRepository.getUserBadges(userId)
    ]);

    return { summary: buildSummary(context, badges, earned) };
  },

  async recalculate(userId: string) {
    await ensureDefaultBadges();
    const context = await buildContext(userId);
    const badges = await gamificationRepository.getActiveBadges();
    const existing = await gamificationRepository.getUserBadges(userId);
    const existingIds = new Set(existing.map((userBadge) => userBadge.badgeId));
    const toAward = badges.filter((badge) => isBadgeEarned(badge, context) && !existingIds.has(badge.id));

    if (toAward.length > 0) {
      await gamificationRepository.awardBadges(
        userId,
        toAward.map((badge) => badge.id)
      );
    }

    const allEarned = await gamificationRepository.getUserBadges(userId);

    return {
      summary: buildSummary(context, badges, allEarned),
      newlyAwardedBadges: toAward.map(toBadgeBase),
      allEarnedBadges: allEarned.map(toEarnedBadge)
    };
  }
};
