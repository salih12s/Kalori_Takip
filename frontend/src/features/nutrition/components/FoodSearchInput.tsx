import { Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { inputClassName } from "../../../lib/ui";
import { useFoodSearch } from "../hooks/useFoodSearch";
import { useImportExternalFood } from "../hooks/useImportExternalFood";
import type {
  FoodResponse,
  FoodSearchResult,
  FoodSearchSource,
  ImportExternalFoodPayload,
} from "../types/nutrition.types";
import { FoodResultCard } from "./FoodResultCard";
import { FoodSourceTabs } from "./FoodSourceTabs";

interface FoodSearchInputProps {
  onSelect: (food: FoodSearchResult) => void;
}

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

export function FoodSearchInput({ onSelect }: FoodSearchInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [source, setSource] = useState<FoodSearchSource>("curated");
  const searchQuery = useFoodSearch(debouncedQuery, source);
  const importMutation = useImportExternalFood();
  const foods = searchQuery.data?.foods ?? [];
  const externalFoods = useMemo(() => foods.filter((food) => food.source === "EXTERNAL"), [foods]);
  const cachedFoods = useMemo(() => foods.filter((food) => food.source !== "EXTERNAL"), [foods]);
  const isExternalSource = source === "external";

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
    <div className="space-y-3">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Yemek ara..."
          className={`${inputClassName} pl-9`}
        />
      </div>

      <FoodSourceTabs value={source} onChange={setSource} />

      {isExternalSource && searchQuery.data?.externalSearchFailed ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {cachedFoods.length > 0
            ? "Dış kaynak araması başarısız oldu. Önbellekteki sonuçlar gösteriliyor."
            : "Dış kaynak araması şu an yapılamıyor. Biraz sonra tekrar dene."}
        </div>
      ) : null}

      {debouncedQuery.length >= 2 ? (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {searchQuery.isLoading ? (
            <p className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-500">
              Yemekler aranıyor...
            </p>
          ) : foods.length > 0 ? (
            <AnimatePresence initial={false}>
              {cachedFoods.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {source === "curated" ? "Yemekler" : "Önbellek"}
                  </p>
                  {cachedFoods.map((food) => (
                    <FoodResultCard
                      key={food.id ?? food.externalId}
                      food={food}
                      isImporting={false}
                      onSelect={onSelect}
                      onImport={handleImport}
                    />
                  ))}
                </div>
              ) : null}

              {externalFoods.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Dış Kaynak</p>
                  {externalFoods.map((food) => (
                    <FoodResultCard
                      key={food.externalId}
                      food={food}
                      isImporting={importMutation.isPending}
                      onSelect={onSelect}
                      onImport={handleImport}
                    />
                  ))}
                </div>
              ) : null}
            </AnimatePresence>
          ) : (
            <p className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-500">
              {source === "external"
                ? "Dış kaynakta sonuç bulunamadı. Farklı bir kelime deneyebilirsin."
                : "Sonuç bulunamadı."}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
