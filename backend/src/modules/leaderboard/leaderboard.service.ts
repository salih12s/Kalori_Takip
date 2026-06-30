import { FollowStatus, LeaderboardPointSource } from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { addDays, formatDateOnly, startOfWeek, todayDateOnly } from "../../shared/utils/date.js";
import { computeStreaks, type StreakSignalLog } from "../../shared/utils/streak.js";
import {
  formatRange,
  mapLeaderboardRow,
  mapPoint,
  mapStoredPoint,
  mapUserSummary
} from "./leaderboard.mapper.js";
import { leaderboardRepository, type DailyScoringData, type LeaderboardDailyLog } from "./leaderboard.repository.js";
import type {
  DailyScoreResponse,
  LeaderboardFollowStatus,
  LeaderboardPeriodResponse,
  LeaderboardSummaryResponse,
  PointItem,
  RecalculateRangeInput
} from "./leaderboard.types.js";

function monthRange(month?: string) {
  const now = todayDateOnly();
  const [year, monthIndex] = month
    ? month.split("-").map(Number)
    : [now.getUTCFullYear(), now.getUTCMonth() + 1];
  const startDate = new Date(Date.UTC(year, monthIndex - 1, 1));
  const endDate = new Date(Date.UTC(year, monthIndex, 0));

  return { startDate, endDate };
}

function hasLoggedFood(log: DailyScoringData["dailyLog"] | LeaderboardDailyLog): boolean {
  return log.meals.some((meal) => meal.entries.length > 0);
}

function hasCompletionActivity(log: DailyScoringData["dailyLog"]): boolean {
  return (
    log.activityEntries.length > 0 ||
    log.workoutSessions.length > 0 ||
    log.waterLogs.length > 0 ||
    log.totalSteps > 0 ||
    Number(log.totalRunKm) > 0 ||
    Number(log.totalWalkKm) > 0 ||
    log.totalWorkoutMinutes > 0 ||
    log.waterMl > 0 ||
    log.isWorkoutDay ||
    log.isOffDay
  );
}

function hasLoggedDay(log: LeaderboardDailyLog): boolean {
  return (
    hasLoggedFood(log) ||
    log.activityEntries.length > 0 ||
    log.workoutSessions.length > 0 ||
    log.waterLogs.length > 0 ||
    log.totalCalories > 0 ||
    Number(log.totalProtein) > 0 ||
    log.totalSteps > 0 ||
    Number(log.totalRunKm) > 0 ||
    Number(log.totalWalkKm) > 0 ||
    log.totalWorkoutMinutes > 0 ||
    log.waterMl > 0 ||
    log.isWorkoutDay ||
    log.isOffDay
  );
}

function buildPoints(data: DailyScoringData): PointItem[] {
  const { dailyLog, goal } = data;
  const points: PointItem[] = [];

  if (hasLoggedFood(dailyLog)) {
    points.push(mapPoint(LeaderboardPointSource.FOOD_LOG, 5, "Food logged"));
  }

  if (goal) {
    const minHealthyCalories = Math.ceil(goal.dailyCalorieGoal * 0.8);
    const maxHealthyCalories = Math.floor(goal.dailyCalorieGoal * 1.1);

    if (dailyLog.totalCalories >= minHealthyCalories && dailyLog.totalCalories <= maxHealthyCalories) {
      points.push(mapPoint(LeaderboardPointSource.CALORIE_GOAL, 10, "Calories stayed in healthy goal range"));
    }

    if (Number(dailyLog.totalProtein) >= goal.dailyProteinGoal) {
      points.push(mapPoint(LeaderboardPointSource.PROTEIN_GOAL, 8, "Protein goal reached"));
    }

    if (dailyLog.totalSteps >= goal.dailyStepGoal) {
      points.push(mapPoint(LeaderboardPointSource.STEP_GOAL, 10, "Step goal reached"));
    }
  }

  if (dailyLog.isWorkoutDay || dailyLog.workoutSessions.length > 0) {
    points.push(mapPoint(LeaderboardPointSource.WORKOUT, 15, "Workout completed"));
  }

  const runScore = Math.floor(Number(dailyLog.totalRunKm)) * 3;
  const walkScore = Math.floor(Number(dailyLog.totalWalkKm)) * 3;

  if (runScore > 0) {
    points.push(mapPoint(LeaderboardPointSource.RUN_DISTANCE, runScore, "Run distance points"));
  }

  if (walkScore > 0) {
    points.push(mapPoint(LeaderboardPointSource.WALK_DISTANCE, walkScore, "Walk distance points"));
  }

  if (dailyLog.isOffDay) {
    points.push(mapPoint(LeaderboardPointSource.OFF_DAY, 3, "Off day logged"));
  }

  if (dailyLog.waterMl > 0) {
    points.push(mapPoint(LeaderboardPointSource.WATER, 3, "Water logged"));
  }

  if (hasLoggedFood(dailyLog) && hasCompletionActivity(dailyLog)) {
    points.push(mapPoint(LeaderboardPointSource.DAILY_COMPLETION, 5, "Daily completion"));
  }

  return points;
}

function toDailyScoreResponse(date: Date, points: PointItem[]): DailyScoreResponse {
  return {
    date: formatDateOnly(date),
    dailyScore: points.reduce((sum, point) => sum + point.score, 0),
    points
  };
}

type LeaderboardScope = "global" | "friends";

function resolveFollowStatus(
  rowUserId: string,
  currentUserId: string,
  followStatuses: Map<string, FollowStatus>
): LeaderboardFollowStatus {
  if (rowUserId === currentUserId) {
    return "SELF";
  }

  const status = followStatuses.get(rowUserId);

  if (status === FollowStatus.ACCEPTED) {
    return "ACCEPTED";
  }

  if (status === FollowStatus.PENDING) {
    return "PENDING";
  }

  return "NONE";
}

async function leaderboardForRange(
  userId: string,
  startDate: Date,
  endDate: Date,
  scope: LeaderboardScope = "global"
): Promise<LeaderboardPeriodResponse> {
  // Global scope shows every registered user; friends scope keeps the follow graph.
  const targetUserIds =
    scope === "friends"
      ? await leaderboardRepository.getVisibleUserIds(userId)
      : await leaderboardRepository.getAllUserIds();
  const [users, logs, followStatuses] = await Promise.all([
    leaderboardRepository.getUsers(targetUserIds),
    leaderboardRepository.getDailyLogsForUsers(targetUserIds, startDate, endDate),
    leaderboardRepository.getFollowStatuses(userId, targetUserIds)
  ]);
  const summaries = new Map(users.map((user) => [user.id, mapUserSummary(user)]));
  const rows = targetUserIds.map((targetUserId) => {
    const userLogs = logs.filter((log) => log.userId === targetUserId);

    return {
      user: summaries.get(targetUserId)!,
      totalScore: userLogs.reduce((sum, log) => sum + log.dailyScore, 0),
      totalSteps: userLogs.reduce((sum, log) => sum + log.totalSteps, 0),
      workoutDays: userLogs.filter((log) => log.isWorkoutDay).length,
      loggedDays: userLogs.filter(hasLoggedDay).length,
      followStatus: resolveFollowStatus(targetUserId, userId, followStatuses)
    };
  });

  rows.sort((a, b) => b.totalScore - a.totalScore || b.totalSteps - a.totalSteps || a.user.username.localeCompare(b.user.username));

  return {
    ...formatRange(startDate, endDate),
    rows: rows.map((row, index) => mapLeaderboardRow(index + 1, row))
  };
}

export const leaderboardService = {
  async recalculate(userId: string, date = todayDateOnly()): Promise<DailyScoreResponse> {
    const data = await leaderboardRepository.getDailyScoringData(userId, date);
    const points = buildPoints(data);
    const dailyScore = points.reduce((sum, point) => sum + point.score, 0);

    await leaderboardRepository.replaceDailyPoints(userId, date, points, dailyScore);

    return toDailyScoreResponse(date, points);
  },

  async recalculateRange(userId: string, input: RecalculateRangeInput) {
    const days = Math.floor((input.endDate.getTime() - input.startDate.getTime()) / 86400000) + 1;

    if (days < 1 || days > 31) {
      throw new AppError("Date range must be between 1 and 31 days", 400);
    }

    const results: DailyScoreResponse[] = [];

    for (let index = 0; index < days; index += 1) {
      results.push(await this.recalculate(userId, addDays(input.startDate, index)));
    }

    return { days: results };
  },

  getWeekly(userId: string, startDate = startOfWeek(todayDateOnly()), scope: LeaderboardScope = "global") {
    return leaderboardForRange(userId, startDate, addDays(startDate, 6), scope);
  },

  getMonthly(userId: string, month?: string, scope: LeaderboardScope = "global") {
    const range = monthRange(month);

    return leaderboardForRange(userId, range.startDate, range.endDate, scope);
  },

  getFriends(userId: string, period: "weekly" | "monthly") {
    return period === "monthly"
      ? this.getMonthly(userId, undefined, "friends")
      : this.getWeekly(userId, undefined, "friends");
  },

  async getMySummary(userId: string): Promise<LeaderboardSummaryResponse> {
    const today = todayDateOnly();
    const week = await this.getWeekly(userId, startOfWeek(today));
    const month = await this.getMonthly(userId, formatDateOnly(today).slice(0, 7));
    const todayPoints = await leaderboardRepository.getDailyPoints(userId, today);
    const streakLogs = await leaderboardRepository.getStreakLogs(userId);
    const { currentStreak } = computeStreaks(streakLogs as StreakSignalLog[]);
    const currentWeeklyRow = week.rows.find((row) => row.user.id === userId);
    const currentMonthlyRow = month.rows.find((row) => row.user.id === userId);

    return {
      todayScore: todayPoints.reduce((sum, point) => sum + point.score, 0),
      weeklyScore: currentWeeklyRow?.totalScore ?? 0,
      monthlyScore: currentMonthlyRow?.totalScore ?? 0,
      weeklyRank: currentWeeklyRow?.rank ?? null,
      monthlyRank: currentMonthlyRow?.rank ?? null,
      pointsBreakdown: todayPoints.map(mapStoredPoint),
      currentStreak
    };
  }
};
