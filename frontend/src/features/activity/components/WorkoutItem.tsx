import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useDeleteWorkout } from "../hooks/useDeleteWorkout";
import type { WorkoutResponse } from "../types/activity.types";
import { workoutTypeLabels } from "../utils/activity-labels";

export function WorkoutItem({ workout, date }: { workout: WorkoutResponse; date: string }) {
  const deleteMutation = useDeleteWorkout(date);

  const handleDelete = () => {
    deleteMutation.mutate(workout.id, {
      onSuccess: () => toast.success("Spor kaydı silindi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
      <div>
        <p className="font-medium text-stone-800">{workout.title}</p>
        <p className="text-xs text-stone-500">{workoutTypeLabels[workout.workoutType]} · {workout.durationMinutes} dk · {workout.caloriesBurned} kcal</p>
        <p className="mt-1 text-xs text-stone-500">Kas grupları: {workout.muscleGroups.length ? workout.muscleGroups.join(", ") : "Belirtilmedi"} · Yoğunluk: {workout.intensity ?? "—"}</p>
        {workout.note ? <p className="mt-1 text-xs text-stone-500">{workout.note}</p> : null}
      </div>
      <button type="button" onClick={handleDelete} disabled={deleteMutation.isPending} aria-label="Spor kaydını sil" className="grid h-9 w-9 place-items-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
        <Trash2 size={17} />
      </button>
    </div>
  );
}
