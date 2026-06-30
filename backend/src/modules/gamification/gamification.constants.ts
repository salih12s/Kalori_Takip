import { BadgeCategory, BadgeTriggerType } from "@prisma/client";

export type DefaultBadge = {
  code: string;
  title: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  triggerType: BadgeTriggerType;
  triggerValue: number | null;
};

/** Seeded automatically (idempotently) by the gamification service. */
export const DEFAULT_BADGES: DefaultBadge[] = [
  { code: "FIRST_FOOD_LOG", title: "İlk Öğün", description: "İlk yemek kaydını ekledin.", icon: "Utensils", category: BadgeCategory.NUTRITION, triggerType: BadgeTriggerType.FIRST_FOOD_LOG, triggerValue: null },
  { code: "FIRST_ACTIVITY", title: "İlk Hareket", description: "İlk aktivite kaydını ekledin.", icon: "Activity", category: BadgeCategory.ACTIVITY, triggerType: BadgeTriggerType.FIRST_ACTIVITY, triggerValue: null },
  { code: "FIRST_WORKOUT", title: "İlk Antrenman", description: "İlk spor kaydını tamamladın.", icon: "Dumbbell", category: BadgeCategory.ACTIVITY, triggerType: BadgeTriggerType.FIRST_WORKOUT, triggerValue: null },
  { code: "FIRST_WATER", title: "Su Başlangıcı", description: "İlk su kaydını ekledin.", icon: "Droplet", category: BadgeCategory.NUTRITION, triggerType: BadgeTriggerType.FIRST_WATER, triggerValue: null },
  { code: "STEP_10K_DAY", title: "10 Bin Adım", description: "Bir günde 10.000 adıma ulaştın.", icon: "Footprints", category: BadgeCategory.ACTIVITY, triggerType: BadgeTriggerType.STEP_DAY, triggerValue: 10000 },
  { code: "RUN_5K_DAY", title: "5K Koşucu", description: "Bir günde 5 km koşu tamamladın.", icon: "Flame", category: BadgeCategory.ACTIVITY, triggerType: BadgeTriggerType.RUN_DISTANCE_DAY, triggerValue: 5 },
  { code: "CALORIE_GOAL_DAY", title: "Dengeli Gün", description: "Kalori hedef aralığında bir günü tamamladın.", icon: "Apple", category: BadgeCategory.NUTRITION, triggerType: BadgeTriggerType.CALORIE_GOAL_DAY, triggerValue: null },
  { code: "PROTEIN_GOAL_DAY", title: "Protein Tamam", description: "Günlük protein hedefini tamamladın.", icon: "Apple", category: BadgeCategory.NUTRITION, triggerType: BadgeTriggerType.PROTEIN_GOAL_DAY, triggerValue: null },
  { code: "STREAK_3", title: "3 Günlük Seri", description: "3 gün üst üste aktif kaldın.", icon: "Flame", category: BadgeCategory.STREAK, triggerType: BadgeTriggerType.STREAK_DAYS, triggerValue: 3 },
  { code: "STREAK_7", title: "7 Günlük Seri", description: "7 gün üst üste aktif kaldın.", icon: "Flame", category: BadgeCategory.STREAK, triggerType: BadgeTriggerType.STREAK_DAYS, triggerValue: 7 },
  { code: "SCORE_50_DAY", title: "Güçlü Gün", description: "Bir günde 50 veya daha fazla puan kazandın.", icon: "Star", category: BadgeCategory.SCORE, triggerType: BadgeTriggerType.DAILY_SCORE, triggerValue: 50 },
  { code: "CHALLENGE_COMPLETED", title: "Challenge Bitti", description: "Bir challenge hedefini tamamladın.", icon: "Swords", category: BadgeCategory.CHALLENGE, triggerType: BadgeTriggerType.CHALLENGE_COMPLETED, triggerValue: null },
  { code: "FIRST_FRIEND", title: "Sosyal Başlangıç", description: "İlk arkadaş bağlantını oluşturdun.", icon: "Users", category: BadgeCategory.SOCIAL, triggerType: BadgeTriggerType.FIRST_FRIEND, triggerValue: null },
];
