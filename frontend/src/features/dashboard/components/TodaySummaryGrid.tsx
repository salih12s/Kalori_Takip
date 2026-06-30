import { Activity, Droplets, Dumbbell, Flame, Footprints } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { TodayDashboardResponse } from "../types/dashboard.types";
import { ActivitySummaryCard } from "./ActivitySummaryCard";
import { CaloriesCard } from "./CaloriesCard";
import { DailyStatusCard } from "./DailyStatusCard";
import { MacroSummaryCard } from "./MacroSummaryCard";

interface TodaySummaryGridProps {
  dashboard: TodayDashboardResponse;
}

export function TodaySummaryGrid({ dashboard }: TodaySummaryGridProps) {
  const { nutrition, activity, status, goal } = dashboard;
  const remainingValue =
    nutrition.remainingCalories == null
      ? "—"
      : nutrition.remainingCalories < 0
        ? Math.abs(nutrition.remainingCalories)
        : nutrition.remainingCalories;
  const remainingDescription =
    nutrition.remainingCalories == null
      ? "Henüz kalori hedefi belirlenmemiş"
      : nutrition.remainingCalories < 0
        ? "Hedefin üzerinde"
        : "Kalan Kalori";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <CaloriesCard nutrition={nutrition} goal={goal} />
      <StatCard title="Kalan Kalori" value={remainingValue} suffix="kcal" description={remainingDescription} icon={Flame} />
      <MacroSummaryCard nutrition={nutrition} />
      <StatCard title="Karbonhidrat" value={nutrition.totalCarbs} suffix="g" progress={nutrition.carbProgress} icon={Activity} />
      <StatCard title="Yağ" value={nutrition.totalFat} suffix="g" progress={nutrition.fatProgress} icon={Droplets} />
      <ActivitySummaryCard activity={activity} />
      <StatCard
        title="Spor Durumu"
        value={activity.isOffDay ? "Dinlenme" : activity.isWorkoutDay ? "Spor" : "Bekliyor"}
        description={`Spor Süresi: ${activity.totalWorkoutMinutes} dk · Yakılan Kalori: ${activity.totalBurnedCalories}`}
        icon={Dumbbell}
      />
      <DailyStatusCard status={status} isWorkoutDay={activity.isWorkoutDay} isOffDay={activity.isOffDay} />
      <StatCard title="Adım Hedefi" value={`${activity.stepProgress}%`} description={`Hedef: ${activity.stepGoal ?? "—"}`} icon={Footprints} />
    </div>
  );
}
