import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useDeleteFoodEntry } from "../hooks/useDeleteFoodEntry";
import type { FoodEntryResponse } from "../types/nutrition.types";

interface FoodEntryItemProps {
  entry: FoodEntryResponse;
  date: string;
}

export function FoodEntryItem({ entry, date }: FoodEntryItemProps) {
  const deleteMutation = useDeleteFoodEntry(date);

  const handleDelete = () => {
    deleteMutation.mutate(entry.id, {
      onSuccess: () => toast.success("Yemek kaydı silindi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-stone-800">{entry.foodNameSnapshot}</p>
        <p className="text-xs text-stone-500">
          {entry.quantity} {entry.unit} · {entry.calories} kcal
        </p>
        <p className="mt-1 text-xs text-stone-500">
          Protein {entry.protein} g · Karbonhidrat {entry.carbs} g · Yağ {entry.fat} g
        </p>
      </div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteMutation.isPending}
        aria-label="Yemek kaydını sil"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
