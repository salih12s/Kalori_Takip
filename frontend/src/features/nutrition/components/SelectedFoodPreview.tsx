import { motion } from "motion/react";

import type { FoodSearchResult } from "../types/nutrition.types";
import { getFoodEmoji } from "../utils/food-emoji";

interface SelectedFoodPreviewProps {
  food: FoodSearchResult;
  quantity: number;
  unit: string;
}

function roundMacro(value: number): number {
  return Math.round(value * 10) / 10;
}

function calculateScaledValue(value: number | null, factor: number): number | null {
  return value == null ? null : roundMacro(value * factor);
}

export function SelectedFoodPreview({ food, quantity, unit }: SelectedFoodPreviewProps) {
  const safeServingSize = food.servingSize > 0 ? food.servingSize : 1;
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? quantity : safeServingSize;
  const factor = safeQuantity / safeServingSize;
  const calories = Math.round(food.calories * factor);
  const protein = calculateScaledValue(food.protein, factor);
  const carbs = calculateScaledValue(food.carbs, factor);
  const fat = calculateScaledValue(food.fat, factor);
  const fiber = calculateScaledValue(food.fiber, factor);
  const sugar = calculateScaledValue(food.sugar, factor);
  const hint =
    unit.toLocaleLowerCase("tr-TR") === "g"
      ? "Gram miktarını değiştirdiğinde kalori ve makrolar otomatik hesaplanır."
      : "Adet miktarına göre değerler otomatik hesaplanır.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-emerald-200 bg-emerald-50 p-3"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Seçilen Yemek</p>
      <div className="mt-2 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-xl">
          {food.imageUrl ? <img src={food.imageUrl} alt="" className="h-10 w-10 rounded-lg object-cover" /> : getFoodEmoji(food.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-stone-900">{food.name}</h3>
          <div className="mt-2 space-y-1 text-xs text-stone-700">
            <p>
              <strong>Porsiyon Değeri:</strong> {food.servingSize} {food.servingUnit} için {food.calories} kcal · Protein {food.protein}g · Karbonhidrat {food.carbs}g · Yağ {food.fat}g
            </p>
            <p>
              <strong>Seçtiğin Miktar:</strong> {safeQuantity} {unit || food.servingUnit} = {calories} kcal · Protein {protein}g · Karbonhidrat {carbs}g · Yağ {fat}g
            </p>
            <p>
              <strong>Lif:</strong> {fiber ?? 0}g · <strong>Şeker:</strong> {sugar ?? 0}g
            </p>
          </div>
          <p className="mt-2 text-[11px] text-emerald-700">{hint}</p>
        </div>
      </div>
    </motion.div>
  );
}
