import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName } from "../../../lib/ui";
import { useFoodSearch } from "../hooks/useFoodSearch";
import { useImportExternalFood } from "../hooks/useImportExternalFood";
import type {
  FoodResponse,
  FoodResultSource,
  FoodSearchResult,
  FoodSearchSource,
  ImportExternalFoodPayload,
} from "../types/nutrition.types";

interface FoodSearchInputProps {
  selectedFood: FoodSearchResult | null;
  onSelect: (food: FoodSearchResult) => void;
}

const sourceOptions: Array<{ value: FoodSearchSource; label: string }> = [
  { value: "all", label: "Tümü" },
  { value: "local", label: "Yerel" },
  { value: "external", label: "Dış Kaynak" },
];

const sourceLabels: Record<FoodResultSource, string> = {
  LOCAL: "Yerel",
  CACHED: "Önbellekte",
  EXTERNAL: "Dış Kaynak",
};

function toImportPayload(food: FoodSearchResult): ImportExternalFoodPayload {
  return {
    externalId: food.externalId ?? "",
    provider: food.provider ?? "OPEN_FOOD_FACTS",
    name: food.name,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
    sugar: food.sugar,
    aliases: [food.name],
  };
}

function toSearchResult(food: FoodResponse): FoodSearchResult {
  return {
    id: food.id,
    externalId: food.externalId,
    provider: food.externalProvider === "OPEN_FOOD_FACTS" ? "OPEN_FOOD_FACTS" : null,
    name: food.name,
    servingSize: food.servingSize,
    servingUnit: food.servingUnit,
    calories: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    fiber: food.fiber,
    sugar: food.sugar,
    source: food.source === "OPEN_FOOD_FACTS" ? "CACHED" : "LOCAL",
    canAddDirectly: true,
    canImport: false,
  };
}

export function FoodSearchInput({ selectedFood, onSelect }: FoodSearchInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [source, setSource] = useState<FoodSearchSource>("all");
  const searchQuery = useFoodSearch(debouncedQuery, source);
  const importMutation = useImportExternalFood();

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const handleImport = (food: FoodSearchResult) => {
    importMutation.mutate(toImportPayload(food), {
      onSuccess: (importedFood) => {
        toast.success("Yemek içe aktarıldı.");
        onSelect(toSearchResult(importedFood));
      },
      onError: (error) => toast.error(getApiErrorMessage(error, "Yemek içe aktarılamadı.")),
    });
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Yemek ara..."
          className={`${inputClassName} pl-9`}
        />
      </div>

      <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-1">
        {sourceOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setSource(option.value)}
            className={`rounded-md px-2 py-1.5 text-xs font-medium transition ${
              source === option.value ? "bg-white text-emerald-700 shadow-sm" : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {selectedFood ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Seçilen yemek: <strong>{selectedFood.name}</strong>
        </div>
      ) : null}

      {searchQuery.data?.externalSearchFailed ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Dış kaynak araması başarısız oldu. Yerel sonuçlar gösteriliyor.
        </div>
      ) : null}

      {debouncedQuery.length >= 2 ? (
        <div className="max-h-72 overflow-y-auto rounded-lg border border-stone-200 bg-white">
          {searchQuery.isLoading ? (
            <p className="px-3 py-3 text-sm text-stone-500">Aranıyor...</p>
          ) : searchQuery.data && searchQuery.data.foods.length > 0 ? (
            searchQuery.data.foods.map((food) => (
              <div
                key={`${food.source}-${food.id ?? food.externalId}`}
                className="border-b border-stone-100 px-3 py-3 last:border-b-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    disabled={!food.canAddDirectly}
                    onClick={() => food.canAddDirectly && onSelect(food)}
                    className="min-w-0 flex-1 text-left disabled:cursor-default"
                  >
                    <span className="block text-sm font-medium text-stone-800">{food.name}</span>
                    <span className="mt-1 block text-xs text-stone-500">
                      {food.servingSize} {food.servingUnit} · {food.calories} kcal · P {food.protein} / K {food.carbs} / Y {food.fat}
                    </span>
                    <span className="mt-2 inline-flex rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                      {sourceLabels[food.source]}
                    </span>
                  </button>

                  {food.canImport ? (
                    <button
                      type="button"
                      disabled={importMutation.isPending}
                      onClick={() => handleImport(food)}
                      className="rounded-lg border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
                    >
                      {importMutation.isPending ? "Aktarılıyor..." : "İçe Aktar"}
                    </button>
                  ) : (
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                      Eklenebilir
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="px-3 py-3 text-sm text-stone-500">Sonuç bulunamadı.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
