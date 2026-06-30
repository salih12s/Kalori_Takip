import type { Badge, UserBadge } from "@prisma/client";

import type { BadgeBase, BadgeWithEarned, EarnedBadge } from "./gamification.types.js";

export function toBadgeBase(badge: Badge): BadgeBase {
  return {
    id: badge.id,
    code: badge.code,
    title: badge.title,
    description: badge.description,
    icon: badge.icon,
    category: badge.category,
    triggerType: badge.triggerType,
    triggerValue: badge.triggerValue
  };
}

export function toBadgeWithEarned(badge: Badge, userBadge?: UserBadge | null): BadgeWithEarned {
  return {
    ...toBadgeBase(badge),
    isEarned: Boolean(userBadge),
    earnedAt: userBadge?.earnedAt ?? null
  };
}

export function toEarnedBadge(userBadge: UserBadge & { badge: Badge }): EarnedBadge {
  return {
    ...toBadgeBase(userBadge.badge),
    earnedAt: userBadge.earnedAt
  };
}
