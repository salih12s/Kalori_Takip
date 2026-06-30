import { Beef } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { DashboardNutrition } from "../types/dashboard.types";

interface MacroSummaryCardProps {
  nutrition: DashboardNutrition;
}

export function MacroSummaryCard({ nutrition }: MacroSummaryCardProps) {
  return (
    <StatCard
      title="Protein"
      value={nutrition.totalProtein}
      suffix="g"
      description={`Karbonhidrat: ${nutrition.totalCarbs} g · Yağ: ${nutrition.totalFat} g`}
      progress={nutrition.proteinProgress}
      icon={Beef}
    />
  );
}
