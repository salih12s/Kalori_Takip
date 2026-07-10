import { EmptyState } from "../../../components/shared/EmptyState";
import type { GoalResponse } from "../types/profile.types";
import { goalTypeLabels } from "../utils/profile-labels";

interface GoalOverviewCardProps {
  goal: GoalResponse | null;
}

export function GoalOverviewCard({ goal }: GoalOverviewCardProps) {
  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Hedef Özeti</h2>

      {!goal ? (
        <EmptyState
          title="Henüz aktif hedefin yok."
          description="Hedef oluşturarak takip sistemini tamamlayabilirsin."
        />
      ) : (
        <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
          <OverviewRow label="Hedef Tipi" value={goalTypeLabels[goal.goalType]} />
          <OverviewRow label="Günlük Kalori" value={`${goal.dailyCalorieGoal} kcal`} />
          <OverviewRow label="Protein" value={`${goal.dailyProteinGoal} g`} />
          <OverviewRow label="Günlük Adım" value={`${goal.dailyStepGoal}`} />
          <OverviewRow label="Haftalık Spor" value={`${goal.weeklyWorkoutGoal}`} />
          <OverviewRow
            label="Hedef Kilo"
            value={goal.targetWeightKg != null ? `${goal.targetWeightKg} kg` : "—"}
          />
        </dl>
      )}
    </section>
  );
}

function OverviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="text-sm font-medium text-stone-900">{value}</dd>
    </div>
  );
}
