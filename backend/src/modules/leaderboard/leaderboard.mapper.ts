import type { LeaderboardPointSource, PrivacyLevel } from "@prisma/client";

import { formatDateOnly } from "../../shared/utils/date.js";
import type { LeaderboardRow, LeaderboardUserSummary, PointItem } from "./leaderboard.types.js";

type UserForLeaderboard = {
  id: string;
  username: string;
  profile: {
    fullName: string | null;
    avatarUrl: string | null;
    privacyLevel: PrivacyLevel;
  } | null;
};

export function mapUserSummary(user: UserForLeaderboard): LeaderboardUserSummary {
  return {
    id: user.id,
    username: user.username,
    fullName: user.profile?.fullName ?? null,
    avatarUrl: user.profile?.avatarUrl ?? null,
    privacyLevel: user.profile?.privacyLevel ?? null
  };
}

export function mapPoint(source: LeaderboardPointSource, score: number, description: string): PointItem {
  return { source, score, description };
}

export function mapStoredPoint(point: { source: LeaderboardPointSource; score: number }): PointItem {
  return {
    source: point.source,
    score: point.score,
    description: describePoint(point.source, point.score)
  };
}

export function mapLeaderboardRow(rank: number, row: Omit<LeaderboardRow, "rank">): LeaderboardRow {
  return { rank, ...row };
}

export function formatRange(startDate: Date, endDate: Date) {
  return {
    startDate: formatDateOnly(startDate),
    endDate: formatDateOnly(endDate)
  };
}

function describePoint(source: LeaderboardPointSource, score: number): string {
  const descriptions: Record<LeaderboardPointSource, string> = {
    AGGREGATE: "Aggregate score",
    FOOD_LOG: "Food logged",
    CALORIE_GOAL: "Calories stayed in healthy goal range",
    PROTEIN_GOAL: "Protein goal reached",
    STEP_GOAL: "Step goal reached",
    WORKOUT: "Workout completed",
    RUN_DISTANCE: `Run distance points (${score})`,
    WALK_DISTANCE: `Walk distance points (${score})`,
    OFF_DAY: "Off day logged",
    WATER: "Water logged",
    DAILY_COMPLETION: "Daily completion"
  };

  return descriptions[source];
}
