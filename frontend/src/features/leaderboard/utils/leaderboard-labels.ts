import type { LeaderboardPointSource } from "../types/leaderboard.types";

/** Turkish labels for each point source returned by the backend. */
export const pointSourceLabels: Record<LeaderboardPointSource, string> = {
  AGGREGATE: "Toplam",
  FOOD_LOG: "Yemek Kaydı",
  CALORIE_GOAL: "Kalori Hedefi",
  PROTEIN_GOAL: "Protein Hedefi",
  STEP_GOAL: "Adım Hedefi",
  WORKOUT: "Spor",
  RUN_DISTANCE: "Koşu Mesafesi",
  WALK_DISTANCE: "Yürüyüş Mesafesi",
  OFF_DAY: "Dinlenme Günü",
  WATER: "Su Kaydı",
  DAILY_COMPLETION: "Günlük Tamamlama",
};

export function pointSourceLabel(source: LeaderboardPointSource): string {
  return pointSourceLabels[source] ?? source;
}
