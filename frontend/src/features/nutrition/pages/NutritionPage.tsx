import { Plus } from "lucide-react";
import { useState } from "react";

import { PageShell } from "../../../components/layout/PageShell";
import { ErrorState } from "../../../components/shared/ErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { inputClassName, primaryButtonClassName } from "../../../lib/ui";
import { CreateFoodDialog } from "../components/CreateFoodDialog";
import { DailyNutritionSummary } from "../components/DailyNutritionSummary";
import { MealCard } from "../components/MealCard";
import { MealTabs } from "../components/MealTabs";
import { NutritionSkeleton } from "../components/NutritionSkeleton";
import { useDailyMeals } from "../hooks/useDailyMeals";
import type { MealType } from "../types/nutrition.types";

function todayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(todayDateInputValue);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("BREAKFAST");
  const [isCreateFoodOpen, setIsCreateFoodOpen] = useState(false);
  const mealsQuery = useDailyMeals(selectedDate);

  if (mealsQuery.isLoading) {
    return (
      <PageShell>
        <NutritionSkeleton />
      </PageShell>
    );
  }

  if (mealsQuery.isError || !mealsQuery.data) {
    return (
      <PageShell>
        <PageHeader
          title="Yemek Günlüğü"
          description="Öğünlerini ve günlük kalori takibini buradan yönet."
        />
        <ErrorState
          title="Yemek günlüğü verileri alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => void mealsQuery.refetch()}
        />
      </PageShell>
    );
  }

  const selectedMeal = mealsQuery.data.meals[selectedMealType];

  return (
    <PageShell>
      <PageHeader
        title="Yemek Günlüğü"
        description="Öğünlerini ve günlük kalori takibini buradan yönet."
        action={
          <button
            type="button"
            onClick={() => setIsCreateFoodOpen(true)}
            className={`${primaryButtonClassName} sm:w-auto`}
          >
            <Plus size={16} />
            Yeni Yemek
          </button>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="nutrition-date" className="text-sm font-medium text-stone-700">
          Tarih
        </label>
        <input
          id="nutrition-date"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className={`${inputClassName} sm:max-w-52`}
        />
      </div>

      <DailyNutritionSummary data={mealsQuery.data} />

      <MealTabs
        selectedMealType={selectedMealType}
        meals={mealsQuery.data.meals}
        onSelect={setSelectedMealType}
      />

      <MealCard date={selectedDate} mealType={selectedMealType} meal={selectedMeal} />

      <CreateFoodDialog open={isCreateFoodOpen} onClose={() => setIsCreateFoodOpen(false)} />
    </PageShell>
  );
}
