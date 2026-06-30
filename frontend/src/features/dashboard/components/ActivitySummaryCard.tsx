import { Footprints } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { DashboardActivity } from "../types/dashboard.types";

interface ActivitySummaryCardProps {
  activity: DashboardActivity;
}

export function ActivitySummaryCard({ activity }: ActivitySummaryCardProps) {
  return (
    <StatCard
      title="Adım"
      value={activity.totalSteps}
      description={`Koşu: ${activity.totalRunKm} km · Yürüyüş: ${activity.totalWalkKm} km · Su: ${activity.waterMl} ml`}
      progress={activity.stepProgress}
      icon={Footprints}
    />
  );
}
