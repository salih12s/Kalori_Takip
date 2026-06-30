import { Dumbbell } from "lucide-react";

import { EmptyState } from "../../../components/shared/EmptyState";
import type { WorkoutResponse } from "../types/activity.types";
import { WorkoutItem } from "./WorkoutItem";

export function WorkoutList({ workouts, date }: { workouts: WorkoutResponse[]; date: string }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Spor Kayıtları</h2>
      <div className="mt-4 space-y-3">
        {workouts.length === 0 ? (
          <EmptyState icon={Dumbbell} title="Bugün henüz spor kaydı yok." />
        ) : (
          workouts.map((workout) => <WorkoutItem key={workout.id} workout={workout} date={date} />)
        )}
      </div>
    </section>
  );
}
