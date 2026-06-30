import { Activity, CalendarRange, Flame, Medal, Trophy } from "lucide-react";

import { ErrorState } from "../../../components/shared/ErrorState";
import { StatCard } from "../../../components/shared/StatCard";
import { useMyLeaderboardSummary } from "../hooks/useMyLeaderboardSummary";

function formatRank(rank: number | null): string {
  return rank === null ? "—" : `${rank}.`;
}

export function MyLeaderboardSummary() {
  const summaryQuery = useMyLeaderboardSummary();

  if (summaryQuery.isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-stone-200 bg-stone-100"
          />
        ))}
      </div>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <ErrorState
        title="Özet alınamadı."
        description="Lütfen tekrar dene."
        onRetry={() => void summaryQuery.refetch()}
      />
    );
  }

  const summary = summaryQuery.data;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <StatCard title="Bugünkü Puan" value={summary.todayScore} icon={Activity} />
      <StatCard title="Haftalık Puan" value={summary.weeklyScore} icon={Trophy} />
      <StatCard title="Aylık Puan" value={summary.monthlyScore} icon={CalendarRange} />
      <StatCard title="Haftalık Sıra" value={formatRank(summary.weeklyRank)} icon={Medal} />
      <StatCard title="Aylık Sıra" value={formatRank(summary.monthlyRank)} icon={Medal} />
      <StatCard title="Seri" value={summary.currentStreak} suffix="gün" icon={Flame} />
    </div>
  );
}
