export type BadgeCategory = "NUTRITION" | "ACTIVITY" | "SOCIAL" | "CHALLENGE" | "STREAK" | "SCORE";

export interface BadgeBase {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  triggerType: string;
  triggerValue: number | null;
}

export interface BadgeWithEarned extends BadgeBase {
  isEarned: boolean;
  earnedAt: string | null;
}

export interface EarnedBadge extends BadgeBase {
  earnedAt: string;
}

export interface CategoryProgress {
  category: BadgeCategory;
  earned: number;
  total: number;
}

export interface GamificationSummary {
  currentStreak: number;
  longestStreak: number;
  activeDaysThisWeek: number;
  totalEarnedBadges: number;
  totalAvailableBadges: number;
  recentBadges: EarnedBadge[];
  badgesByCategory: CategoryProgress[];
  todayScore: number;
  weeklyScore: number;
}

export interface RecalculateResult {
  summary: GamificationSummary;
  newlyAwardedBadges: BadgeBase[];
  allEarnedBadges: EarnedBadge[];
}
