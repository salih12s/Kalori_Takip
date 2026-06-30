import type { ChallengeType } from "../types/challenge.types";

export const challengeTypeLabels: Record<ChallengeType, string> = {
  STEPS: "Adım",
  FOOD_LOG: "Yemek Kaydı",
  WORKOUT: "Spor",
  RUN_DISTANCE: "Koşu Mesafesi",
  WATER: "Su",
};

export const challengeTypeOptions: Array<{ value: ChallengeType; label: string }> = (
  Object.keys(challengeTypeLabels) as ChallengeType[]
).map((value) => ({ value, label: challengeTypeLabels[value] }));

/** Suggested default unit when a challenge type is selected. */
export const defaultUnitByType: Record<ChallengeType, string> = {
  STEPS: "adım",
  FOOD_LOG: "gün",
  WORKOUT: "gün",
  RUN_DISTANCE: "km",
  WATER: "ml",
};

export function formatShortDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("tr-TR");
}
