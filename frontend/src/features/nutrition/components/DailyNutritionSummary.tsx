import { Beef, Flame, Wheat } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { DailyMealsResponse } from "../types/nutrition.types";

interface DailyNutritionSummaryProps {
  data: DailyMealsResponse;
}

export function DailyNutritionSummary({ data }: DailyNutritionSummaryProps) {
  const totals = data.dailyTotals;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard title="Toplam Kalori" value={totals.totalCalories} suffix="kcal" icon={Flame} />
      <StatCard title="Protein" value={totals.totalProtein} suffix="g" icon={Beef} />
      <StatCard title="Karbonhidrat" value={totals.totalCarbs} suffix="g" icon={Wheat} />
      <StatCard title="Yağ" value={totals.totalFat} suffix="g" icon={Flame} />
    </div>
  );
}
