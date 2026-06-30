import { PageShell } from "../../../components/layout/PageShell";
import { ErrorState } from "../../../components/shared/ErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { MealsPreviewCard } from "../components/MealsPreviewCard";
import { TodaySummaryGrid } from "../components/TodaySummaryGrid";
import { WeeklySummarySection } from "../components/WeeklySummarySection";
import { useTodayDashboard } from "../hooks/useTodayDashboard";
import { useWeeklyDashboard } from "../hooks/useWeeklyDashboard";

export function DashboardPage() {
  const todayQuery = useTodayDashboard();
  const weeklyQuery = useWeeklyDashboard();

  if (todayQuery.isLoading || weeklyQuery.isLoading) {
    return (
      <PageShell>
        <DashboardSkeleton />
      </PageShell>
    );
  }

  if (todayQuery.isError || weeklyQuery.isError || !todayQuery.data || !weeklyQuery.data) {
    return (
      <PageShell>
        <PageHeader
          title="Dashboard"
          description="Bugünkü kalori, aktivite ve hedef durumunu buradan takip et."
        />
        <ErrorState
          title="Dashboard verileri alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => {
            void todayQuery.refetch();
            void weeklyQuery.refetch();
          }}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        description="Bugünkü kalori, aktivite ve hedef durumunu buradan takip et."
      />

      <TodaySummaryGrid dashboard={todayQuery.data} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)]">
        <WeeklySummarySection weekly={weeklyQuery.data} />
        <MealsPreviewCard meals={todayQuery.data.mealsPreview} />
      </div>
    </PageShell>
  );
}
