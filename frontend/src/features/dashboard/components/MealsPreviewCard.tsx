import { Utensils } from "lucide-react";

import { EmptyState } from "../../../components/shared/EmptyState";
import type { MealPreview, MealType } from "../types/dashboard.types";

interface MealsPreviewCardProps {
  meals: MealPreview[];
}

const mealTypeLabels: Record<MealType, string> = {
  BREAKFAST: "Kahvaltı",
  LUNCH: "Öğle",
  DINNER: "Akşam",
  SNACK: "Ara Öğün",
};

export function MealsPreviewCard({ meals }: MealsPreviewCardProps) {
  const mealsWithEntries = meals.filter((meal) => meal.entryCount > 0);

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-stone-900">Bugünkü Öğünler</h2>
          <p className="text-sm text-stone-500">Yemek kayıtlarının kısa özeti</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <Utensils size={18} />
        </span>
      </div>

      {mealsWithEntries.length === 0 ? (
        <EmptyState
          title="Bugün henüz yemek eklemedin."
          description="Yemek Günlüğü sayfasından ilk öğününü ekleyebilirsin."
          icon={Utensils}
        />
      ) : (
        <div className="space-y-3">
          {mealsWithEntries.map((meal) => (
            <div key={meal.mealType} className="rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-stone-800">{mealTypeLabels[meal.mealType]}</p>
                  <p className="text-xs text-stone-500">{meal.entryCount} kayıt</p>
                </div>
                <p className="text-sm font-semibold text-stone-900">{meal.totalCalories} kcal</p>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Protein {meal.totalProtein} g · Karbonhidrat {meal.totalCarbs} g · Yağ {meal.totalFat} g
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
