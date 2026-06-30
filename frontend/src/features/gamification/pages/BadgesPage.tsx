import { PageShell } from "../../../components/layout/PageShell";
import { ErrorState } from "../../../components/shared/ErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { BadgeGrid } from "../components/BadgeGrid";
import { GamificationSkeleton } from "../components/GamificationSkeleton";
import { GamificationSummaryCard } from "../components/GamificationSummaryCard";
import { RecalculateGamificationButton } from "../components/RecalculateGamificationButton";
import { RecentBadges } from "../components/RecentBadges";
import { StreakCard } from "../components/StreakCard";
import { useBadges } from "../hooks/useBadges";
import { useGamificationSummary } from "../hooks/useGamificationSummary";

export function BadgesPage() {
  const summaryQuery = useGamificationSummary();
  const badgesQuery = useBadges();

  if (summaryQuery.isLoading || badgesQuery.isLoading) {
    return (
      <PageShell>
        <GamificationSkeleton />
      </PageShell>
    );
  }

  if (summaryQuery.isError || badgesQuery.isError || !summaryQuery.data || !badgesQuery.data) {
    return (
      <PageShell>
        <PageHeader
          title="Rozetler"
          description="Günlük serini, başarılarını ve kazandığın rozetleri takip et."
        />
        <ErrorState
          title="Rozet verileri alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => {
            void summaryQuery.refetch();
            void badgesQuery.refetch();
          }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Rozetler"
        description="Günlük serini, başarılarını ve kazandığın rozetleri takip et."
        action={<RecalculateGamificationButton />}
      />

      <StreakCard summary={summaryQuery.data} />
      <GamificationSummaryCard summary={summaryQuery.data} />
      <RecentBadges badges={summaryQuery.data.recentBadges} />
      <BadgeGrid badges={badgesQuery.data} />
    </PageShell>
  );
}
