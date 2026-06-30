import type { LeaderboardPointSource, PrivacyLevel } from "@prisma/client";

export type RecalculateInput = {
  date?: Date;
};

export type RecalculateRangeInput = {
  startDate: Date;
  endDate: Date;
};

export type PointItem = {
  source: LeaderboardPointSource;
  score: number;
  description: string;
};

export type DailyScoreResponse = {
  date: string;
  dailyScore: number;
  points: PointItem[];
};

export type LeaderboardUserSummary = {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  privacyLevel: PrivacyLevel | null;
};

export type LeaderboardRow = {
  rank: number;
  user: LeaderboardUserSummary;
  totalScore: number;
  totalSteps: number;
  workoutDays: number;
  loggedDays: number;
};

export type LeaderboardPeriodResponse = {
  startDate: string;
  endDate: string;
  rows: LeaderboardRow[];
};

export type LeaderboardSummaryResponse = {
  todayScore: number;
  weeklyScore: number;
  monthlyScore: number;
  weeklyRank: number | null;
  monthlyRank: number | null;
  pointsBreakdown: PointItem[];
  currentStreak: number;
};
