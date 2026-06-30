import type { MealType } from "../types/nutrition.types";

export const mealTypes: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

export const mealLabels: Record<MealType, string> = {
  BREAKFAST: "Kahvaltı",
  LUNCH: "Öğle",
  DINNER: "Akşam",
  SNACK: "Ara Öğün",
};
