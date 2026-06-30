import { CalendarDays } from "lucide-react";

import { StatCard } from "../../../components/shared/StatCard";
import type { WeeklyDashboardResponse } from "../types/dashboard.types";

interface WeeklySummarySectionProps {
  weekly: WeeklyDashboardResponse;
}

const dayFormatter = new Intl.DateTimeFormat("tr-TR", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
});

export function WeeklySummarySection({ weekly }: WeeklySummarySectionProps) {
  const { summary } = weekly;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Haftalık Özet</h2>
        <p className="text-sm text-stone-500">
          {weekly.startDate} - {weekly.endDate} aralığındaki ilerlemen
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Ortalama Kalori" value={summary.averageCalories} suffix="kcal" />
        <StatCard title="Toplam Adım" value={summary.totalSteps} description={`Ortalama: ${summary.averageSteps}`} />
        <StatCard title="Spor Günü" value={summary.workoutDays} description={`Dinlenme Günü: ${summary.offDays}`} />
        <StatCard title="Haftalık Puan" value={summary.totalScore} description={`Kayıtlı Gün: ${summary.loggedDays}`} />
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-stone-800">
          <CalendarDays size={18} className="text-emerald-600" />
          7 Günlük Liste
        </div>
        <div className="grid gap-2">
          {weekly.days.map((day) => (
            <div key={day.date} className="grid grid-cols-2 gap-3 rounded-lg bg-stone-50 px-3 py-2 text-sm md:grid-cols-5">
              <span className="font-medium text-stone-700">{dayFormatter.format(new Date(`${day.date}T00:00:00`))}</span>
              <span className="text-stone-500">{day.totalCalories} kcal</span>
              <span className="text-stone-500">{day.totalSteps} adım</span>
              <span className="text-stone-500">{day.isWorkoutDay ? "Spor Günü" : day.isOffDay ? "Dinlenme" : "Normal"}</span>
              <span className="text-right font-medium text-stone-800 md:text-left">{day.dailyScore} puan</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
