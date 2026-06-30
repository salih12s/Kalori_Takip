import { Search } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

import { inputClassName } from "../../../lib/ui";
import { useFoodSearch } from "../hooks/useFoodSearch";
import type { FoodSearchResult } from "../types/nutrition.types";
import { FoodResultCard } from "./FoodResultCard";

interface FoodSearchInputProps {
  onSelect: (food: FoodSearchResult) => void;
}

export function FoodSearchInput({ onSelect }: FoodSearchInputProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const searchQuery = useFoodSearch(debouncedQuery, "curated");
  const foods = searchQuery.data?.foods ?? [];

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(timeout);
  }, [query]);

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

      {debouncedQuery.length >= 2 ? (
        <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {searchQuery.isLoading ? (
            <p className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-500">
              Yemekler aranıyor...
            </p>
          ) : foods.length > 0 ? (
            <AnimatePresence initial={false}>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Yemekler</p>
                {foods.map((food) => (
                  <FoodResultCard key={food.id ?? food.externalId} food={food} onSelect={onSelect} />
                ))}
              </div>
            </AnimatePresence>
          ) : (
            <p className="rounded-lg border border-stone-200 bg-white px-3 py-3 text-sm text-stone-500">
              Sonuç bulunamadı.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
