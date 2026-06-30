import { Flame } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { DashboardGoal, DashboardNutrition } from "../types/dashboard.types";

interface CaloriesCardProps {
  nutrition: DashboardNutrition;
  goal: DashboardGoal | null;
}

export function CaloriesCard({ nutrition, goal }: CaloriesCardProps) {
  const remainingText =
    nutrition.remainingCalories == null
      ? "Henüz kalori hedefi belirlenmemiş"
      : nutrition.remainingCalories < 0
        ? `${Math.abs(nutrition.remainingCalories)} kcal hedefin üzerinde`
        : `${nutrition.remainingCalories} kcal kaldı`;

  return (
    <StatCard
      title="Bugünkü Kalori"
      value={nutrition.totalCalories}
      suffix="kcal"
      description={goal ? `Hedef: ${goal.dailyCalorieGoal} kcal · ${remainingText}` : remainingText}
      progress={nutrition.calorieProgress}
      icon={Flame}
    />
  );
}
