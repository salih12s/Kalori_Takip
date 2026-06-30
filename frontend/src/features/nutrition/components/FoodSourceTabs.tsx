import type { FoodSearchSource } from "../types/nutrition.types";

interface FoodSourceTabsProps {
  value: FoodSearchSource;
  onChange: (value: FoodSearchSource) => void;
}

const sourceOptions: Array<{ value: FoodSearchSource; label: string }> = [
  { value: "external", label: "Dış kaynakta ara" },
  { value: "all", label: "Tümü" },
  { value: "local", label: "Önbellek" },
];

export function FoodSourceTabs({ value, onChange }: FoodSourceTabsProps) {
  return (
    <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 p-1">
      {sourceOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-2 py-1.5 text-xs font-medium transition ${
            value === option.value ? "bg-white text-emerald-700 shadow-sm" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
