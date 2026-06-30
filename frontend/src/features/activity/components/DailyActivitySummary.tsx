import { Droplets, Dumbbell, Flame, Footprints, Moon, Route } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { ActivityTotalsResponse } from "../types/activity.types";

export function DailyActivitySummary({ totals }: { totals: ActivityTotalsResponse }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard title="Adım" value={totals.totalSteps} icon={Footprints} />
      <StatCard title="Koşu" value={totals.totalRunKm} suffix="km" icon={Route} />
      <StatCard title="Yürüyüş" value={totals.totalWalkKm} suffix="km" icon={Route} />
      <StatCard title="Spor Süresi" value={totals.totalWorkoutMinutes} suffix="dk" icon={Dumbbell} />
      <StatCard title="Yakılan Kalori" value={totals.totalBurnedCalories} suffix="kcal" icon={Flame} />
      <StatCard title="Su" value={totals.waterMl} suffix="ml" icon={Droplets} />
      <StatCard title="Spor Günü" value={totals.isWorkoutDay ? "Evet" : "Hayır"} icon={Dumbbell} />
      <StatCard title="Dinlenme Günü" value={totals.isOffDay ? "Evet" : "Hayır"} icon={Moon} />
    </div>
  );
}
