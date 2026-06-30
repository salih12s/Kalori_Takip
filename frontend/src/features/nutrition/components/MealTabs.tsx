import { cn } from "../../../lib/cn";
import type { MealType, MealsByType } from "../types/nutrition.types";
import { mealLabels, mealTypes } from "../utils/meal-labels";

interface MealTabsProps {
  selectedMealType: MealType;
  meals: MealsByType;
  onSelect: (mealType: MealType) => void;
}

export function MealTabs({ selectedMealType, meals, onSelect }: MealTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
      {mealTypes.map((mealType) => {
        const meal = meals[mealType];
        const entryCount = meal?.entries.length ?? 0;
        const totalCalories = meal?.entries.reduce((sum, entry) => sum + entry.calories, 0) ?? 0;

        return (
          <button
            key={mealType}
            type="button"
            onClick={() => onSelect(mealType)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left transition-colors",
              selectedMealType === mealType
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            )}
          >
            <span className="block text-sm font-semibold">{mealLabels[mealType]}</span>
            <span className="mt-1 block text-xs text-current/70">
              {entryCount} kayıt · {totalCalories} kcal
            </span>
          </button>
        );
      })}
    </div>
  );
}
