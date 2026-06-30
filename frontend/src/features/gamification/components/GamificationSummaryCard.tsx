import { Activity, Award, Medal, Star, Trophy } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { GamificationSummary } from "../types/gamification.types";

interface GamificationSummaryCardProps {
  summary: GamificationSummary;
}

export function GamificationSummaryCard({ summary }: GamificationSummaryCardProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-stone-900">Gamification Özeti</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Kazanılan Rozet" value={summary.totalEarnedBadges} icon={Award} />
        <StatCard title="Toplam Rozet" value={summary.totalAvailableBadges} icon={Medal} />
        <StatCard title="Bu Haftaki Aktif Gün" value={summary.activeDaysThisWeek} icon={Activity} />
        <StatCard title="Bugünkü Puan" value={summary.todayScore} icon={Star} />
        <StatCard title="Haftalık Puan" value={summary.weeklyScore} icon={Trophy} />
      </div>
    </section>
  );
}
