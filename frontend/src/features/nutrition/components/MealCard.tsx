import { Plus, Utensils } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "../../../components/shared/EmptyState";
import { primaryButtonClassName } from "../../../lib/ui";
import type { MealResponse, MealType } from "../types/nutrition.types";
import { mealLabels } from "../utils/meal-labels";
import { AddFoodEntryDialog } from "./AddFoodEntryDialog";
import { FoodEntryItem } from "./FoodEntryItem";

interface MealCardProps {
  date: string;
  mealType: MealType;
  meal: MealResponse | null;
}

export function MealCard({ date, mealType, meal }: MealCardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const entries = meal?.entries ?? [];
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0);

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{mealLabels[mealType]}</h2>
          <p className="text-sm text-stone-500">
            {entries.length} kayıt · {totalCalories} kcal
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddDialogOpen(true)}
          className={`${primaryButtonClassName} sm:w-auto`}
        >
          <Plus size={16} />
          Yemek Ekle
        </button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title="Bu öğüne henüz yemek eklenmedi."
          description="Yemek eklemek için yukarıdaki butonu kullanabilirsin."
        />
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <FoodEntryItem key={entry.id} entry={entry} date={date} />
          ))}
        </div>
      )}

      <AddFoodEntryDialog
        open={isAddDialogOpen}
        date={date}
        mealType={mealType}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </section>
  );
}
