import { useState } from "react";

import { PageShell } from "../../../components/layout/PageShell";
import { ErrorState } from "../../../components/shared/ErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { useAuth } from "../../auth/hooks/useAuth";
import { LeaderboardSkeleton } from "../components/LeaderboardSkeleton";
import { LeaderboardTable } from "../components/LeaderboardTable";
import { LeaderboardTabs, type LeaderboardTab } from "../components/LeaderboardTabs";
import { MyLeaderboardSummary } from "../components/MyLeaderboardSummary";
import { PointsBreakdownCard } from "../components/PointsBreakdownCard";
import { RecalculateScoreButton } from "../components/RecalculateScoreButton";
import { useFriendsLeaderboard } from "../hooks/useFriendsLeaderboard";
import { useMonthlyLeaderboard } from "../hooks/useMonthlyLeaderboard";
import { useWeeklyLeaderboard } from "../hooks/useWeeklyLeaderboard";

export function LeaderboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<LeaderboardTab>("weekly");

  const weeklyQuery = useWeeklyLeaderboard(undefined, tab === "weekly");
  const monthlyQuery = useMonthlyLeaderboard(undefined, tab === "monthly");
  const friendsQuery = useFriendsLeaderboard("weekly", tab === "friends");

  const activeQuery =
    tab === "weekly" ? weeklyQuery : tab === "monthly" ? monthlyQuery : friendsQuery;

  return (
    <PageShell>
      <PageHeader
        title="Liderlik Tablosu"
        description="Arkadaşlarınla haftalık ve aylık ilerlemeni karşılaştır."
        action={<RecalculateScoreButton />}
      />

      <MyLeaderboardSummary />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
        <div className="space-y-4">
          <LeaderboardTabs active={tab} onChange={setTab} />

          {activeQuery.isLoading ? (
            <LeaderboardSkeleton />
          ) : activeQuery.isError || !activeQuery.data ? (
            <ErrorState
              title="Liderlik tablosu alınamadı."
              description="Lütfen tekrar dene."
              onRetry={() => void activeQuery.refetch()}
            />
          ) : (
            <LeaderboardTable rows={activeQuery.data.rows} currentUserId={user?.id} />
          )}
        </div>

        <PointsBreakdownCard />
      </div>
    </PageShell>
  );
}
