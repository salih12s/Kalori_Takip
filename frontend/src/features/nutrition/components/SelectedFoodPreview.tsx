import { motion } from "motion/react";

import type { FoodSearchResult } from "../types/nutrition.types";
import { getFoodEmoji } from "../utils/food-emoji";

interface SelectedFoodPreviewProps {
  food: FoodSearchResult;
}

export function SelectedFoodPreview({ food }: SelectedFoodPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-emerald-200 bg-emerald-50 p-3"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Seçilen Yemek</p>
      <div className="mt-2 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-xl">
          {getFoodEmoji(food.name)}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-stone-900">{food.name}</h3>
          <p className="mt-1 text-xs text-stone-600">
            {food.servingSize} {food.servingUnit} · {food.calories} kcal
          </p>
          <p className="mt-1 text-xs text-stone-600">
            Protein {food.protein}g · Karbonhidrat {food.carbs}g · Yağ {food.fat}g
          </p>
        </div>
      </div>
    </motion.div>
  );
}
