export type LeaderboardPointSource =
  | "AGGREGATE"
  | "FOOD_LOG"
  | "CALORIE_GOAL"
  | "PROTEIN_GOAL"
  | "STEP_GOAL"
  | "WORKOUT"
  | "RUN_DISTANCE"
  | "WALK_DISTANCE"
  | "OFF_DAY"
  | "WATER"
  | "DAILY_COMPLETION";

export type LeaderboardPeriod = "weekly" | "monthly";

export type PrivacyLevel = "PUBLIC" | "FRIENDS" | "PRIVATE";

export interface PointItem {
  source: LeaderboardPointSource;
  score: number;
  description: string;
}

export interface DailyScoreResponse {
  date: string;
  dailyScore: number;
  points: PointItem[];
}

export interface LeaderboardUserSummary {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  privacyLevel: PrivacyLevel | null;
}

export interface LeaderboardRow {
  rank: number;
  user: LeaderboardUserSummary;
  totalScore: number;
  totalSteps: number;
  workoutDays: number;
  loggedDays: number;
}

export interface LeaderboardPeriodResponse {
  startDate: string;
  endDate: string;
  rows: LeaderboardRow[];
}

export interface LeaderboardSummary {
  todayScore: number;
  weeklyScore: number;
  monthlyScore: number;
  weeklyRank: number | null;
  monthlyRank: number | null;
  pointsBreakdown: PointItem[];
  currentStreak: number;
}
