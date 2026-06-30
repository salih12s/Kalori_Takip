import { useState } from "react";

import { PageShell } from "../../../components/layout/PageShell";
import { ErrorState } from "../../../components/shared/ErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { inputClassName } from "../../../lib/ui";
import { ActivityEntryForm } from "../components/ActivityEntryForm";
import { ActivityEntryList } from "../components/ActivityEntryList";
import { ActivitySkeleton } from "../components/ActivitySkeleton";
import { DailyActivitySummary } from "../components/DailyActivitySummary";
import { OffDayCard } from "../components/OffDayCard";
import { WaterLogForm } from "../components/WaterLogForm";
import { WaterLogList } from "../components/WaterLogList";
import { WorkoutForm } from "../components/WorkoutForm";
import { WorkoutList } from "../components/WorkoutList";
import { useDailyActivity } from "../hooks/useDailyActivity";

function todayDateInputValue(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ActivityPage() {
  const [selectedDate, setSelectedDate] = useState(todayDateInputValue);
  const activityQuery = useDailyActivity(selectedDate);

  if (activityQuery.isLoading) {
    return (
      <PageShell>
        <ActivitySkeleton />
      </PageShell>
    );
  }

  if (activityQuery.isError || !activityQuery.data) {
    return (
      <PageShell>
        <PageHeader title="Aktivite" description="Adım, koşu, yürüyüş, spor, su ve dinlenme günlerini buradan takip et." />
        <ErrorState title="Aktivite verileri alınamadı." description="Lütfen tekrar dene." onRetry={() => void activityQuery.refetch()} />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader title="Aktivite" description="Adım, koşu, yürüyüş, spor, su ve dinlenme günlerini buradan takip et." />

      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor="activity-date" className="text-sm font-medium text-stone-700">Tarih</label>
        <input id="activity-date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className={`${inputClassName} sm:max-w-52`} />
      </div>

      <DailyActivitySummary totals={activityQuery.data.dailyTotals} />

      <div className="grid gap-6 xl:grid-cols-2">
        <ActivityEntryForm date={selectedDate} />
        <WorkoutForm date={selectedDate} />
        <WaterLogForm date={selectedDate} />
        <OffDayCard date={selectedDate} totals={activityQuery.data.dailyTotals} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ActivityEntryList activities={activityQuery.data.activities} date={selectedDate} />
        <WorkoutList workouts={activityQuery.data.workouts} date={selectedDate} />
        <WaterLogList waterLogs={activityQuery.data.waterLogs} date={selectedDate} />
      </div>
    </PageShell>
  );
}
