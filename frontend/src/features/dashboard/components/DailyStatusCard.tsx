import { CheckCircle2, Circle, Trophy } from "lucide-react";

import type { DashboardStatus } from "../types/dashboard.types";

interface DailyStatusCardProps {
  status: DashboardStatus;
  isWorkoutDay: boolean;
  isOffDay: boolean;
}

const statusItems = [
  ["hasLoggedFood", "Yemek Kaydı"],
  ["hasReachedCalorieGoal", "Kalori Hedefi"],
  ["hasReachedProteinGoal", "Protein Hedefi"],
  ["hasReachedStepGoal", "Adım Hedefi"],
] as const;

export function DailyStatusCard({ status, isWorkoutDay, isOffDay }: DailyStatusCardProps) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-500">Günlük Puan</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-stone-900">{status.dailyScore}</span>
            <span className="text-sm text-stone-400">puan</span>
          </div>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
          <Trophy size={18} />
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <StatusLine label="Spor Günü" value={isWorkoutDay} />
        <StatusLine label="Dinlenme Günü" value={isOffDay} />
        {statusItems.map(([key, label]) => (
          <StatusLine key={key} label={label} value={status[key]} />
        ))}
      </div>
    </section>
  );
}

function StatusLine({ label, value }: { label: string; value: boolean }) {
  const Icon = value ? CheckCircle2 : Circle;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-stone-50 px-3 py-2">
      <span className="text-stone-600">{label}</span>
      <span className={value ? "inline-flex items-center gap-1 text-emerald-600" : "inline-flex items-center gap-1 text-stone-400"}>
        <Icon size={15} />
        {value ? "Tamam" : "Bekliyor"}
      </span>
    </div>
  );
}
