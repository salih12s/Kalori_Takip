import {
  Activity,
  Apple,
  Award,
  Droplet,
  Dumbbell,
  Flame,
  Footprints,
  Star,
  Swords,
  Trophy,
  Users,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import type { BadgeCategory } from "../types/gamification.types";

export const categoryLabels: Record<BadgeCategory, string> = {
  NUTRITION: "Beslenme",
  ACTIVITY: "Aktivite",
  SOCIAL: "Sosyal",
  CHALLENGE: "Liderlik",
  STREAK: "Seri",
  SCORE: "Puan",
};

const badgeIcons: Record<string, LucideIcon> = {
  Utensils,
  Activity,
  Dumbbell,
  Droplet,
  Footprints,
  Flame,
  Apple,
  Star,
  Swords,
  Users,
  Trophy,
  Award,
};

/** Resolve a badge's icon string to a lucide component, falling back to Award. */
export function getBadgeIcon(icon: string): LucideIcon {
  return badgeIcons[icon] ?? Award;
}

export function formatShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("tr-TR");
}
