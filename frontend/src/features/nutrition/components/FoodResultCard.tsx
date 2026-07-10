import { motion } from "motion/react";

import type { FoodResultSource, FoodSearchResult } from "../types/nutrition.types";
import { getFoodEmoji } from "../utils/food-emoji";

interface FoodResultCardProps {
  food: FoodSearchResult;
  onSelect: (food: FoodSearchResult) => void;
}

const sourceLabels: Record<FoodResultSource, string> = {
  LOCAL: "Yemekler",
  CACHED: "Yemekler",
  EXTERNAL: "Yemekler",
};

export function FoodResultCard({ food, onSelect }: FoodResultCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      className="rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        {food.imageUrl ? (
          <img src={food.imageUrl} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-50 text-xl">{getFoodEmoji(food.name)}</span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="min-w-0 text-sm font-semibold text-stone-900">{food.name}</h4>
            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
              {sourceLabels[food.source]}
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-500">
            {food.servingSize} {food.servingUnit} · {food.calories} kcal
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Protein {food.protein}g · Karbonhidrat {food.carbs}g · Yağ {food.fat}g
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onSelect(food)}
        className="mt-3 w-full rounded-lg border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
      >
        Seç ve Ekle
      </button>
    </motion.div>
  );
}
