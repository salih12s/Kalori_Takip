import { Flame } from "lucide-react";

import type { GamificationSummary } from "../types/gamification.types";

interface StreakCardProps {
  summary: GamificationSummary;
}

export function StreakCard({ summary }: StreakCardProps) {
  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Seri Durumu</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-orange-50 p-4 text-center">
          <Flame size={22} className="mx-auto mb-1 text-orange-500" />
          <p className="text-2xl font-bold text-stone-900">{summary.currentStreak}</p>
          <p className="text-xs font-medium text-stone-500">Günlük Seri</p>
        </div>
        <div className="rounded-lg bg-emerald-50 p-4 text-center">
          <Flame size={22} className="mx-auto mb-1 text-emerald-600" />
          <p className="text-2xl font-bold text-stone-900">{summary.longestStreak}</p>
          <p className="text-xs font-medium text-stone-500">En Uzun Seri</p>
        </div>
      </div>

      <p className="text-sm text-stone-500">
        Aktif günlerini üst üste tamamlayarak serini büyüt.
      </p>
    </section>
  );
}
