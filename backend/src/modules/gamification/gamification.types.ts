import type { BadgeCategory, BadgeTriggerType } from "@prisma/client";

export type BadgeBase = {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  triggerType: BadgeTriggerType;
  triggerValue: number | null;
};

export type BadgeWithEarned = BadgeBase & {
  isEarned: boolean;
  earnedAt: Date | null;
};

export type EarnedBadge = BadgeBase & {
  earnedAt: Date;
};

export type CategoryProgress = {
  category: BadgeCategory;
  earned: number;
  total: number;
};

export type GamificationSummary = {
  currentStreak: number;
  longestStreak: number;
  activeDaysThisWeek: number;
  totalEarnedBadges: number;
  totalAvailableBadges: number;
  recentBadges: EarnedBadge[];
  badgesByCategory: CategoryProgress[];
  todayScore: number;
  weeklyScore: number;
};

export type RecalculateResponse = {
  summary: GamificationSummary;
  newlyAwardedBadges: BadgeBase[];
  allEarnedBadges: EarnedBadge[];
};
