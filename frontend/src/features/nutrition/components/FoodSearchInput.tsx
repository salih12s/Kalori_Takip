import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { inputClassName } from "../../../lib/ui";
import { useFoodSearch } from "../hooks/useFoodSearch";
import type { FoodResponse } from "../types/nutrition.types";

interface FoodSearchInputProps {
  selectedFood: FoodResponse | null;
  onSelect: (food: FoodResponse) => void;
}

export function FoodSearchInput({ selectedFood, onSelect }: FoodSearchInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchQuery = useFoodSearch(debouncedQuery);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

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

      {selectedFood ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Seçilen yemek: <strong>{selectedFood.name}</strong>
        </div>
      ) : null}

      {debouncedQuery.length >= 2 ? (
        <div className="max-h-60 overflow-y-auto rounded-lg border border-stone-200 bg-white">
          {searchQuery.isLoading ? (
            <p className="px-3 py-3 text-sm text-stone-500">Aranıyor...</p>
          ) : searchQuery.data && searchQuery.data.length > 0 ? (
            searchQuery.data.map((food) => (
              <button
                key={food.id}
                type="button"
                onClick={() => onSelect(food)}
                className="block w-full border-b border-stone-100 px-3 py-3 text-left last:border-b-0 hover:bg-stone-50"
              >
                <span className="block text-sm font-medium text-stone-800">{food.name}</span>
                <span className="mt-1 block text-xs text-stone-500">
                  {food.servingSize} {food.servingUnit} · {food.calories} kcal · P {food.protein} / K {food.carbs} / Y {food.fat}
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-3 text-sm text-stone-500">Sonuç bulunamadı.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
