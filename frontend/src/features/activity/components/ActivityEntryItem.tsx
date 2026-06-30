import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useDeleteActivity } from "../hooks/useDeleteActivity";
import type { ActivityEntryResponse } from "../types/activity.types";
import { activityTypeLabels } from "../utils/activity-labels";

export function ActivityEntryItem({ entry, date }: { entry: ActivityEntryResponse; date: string }) {
  const deleteMutation = useDeleteActivity(date);

  const handleDelete = () => {
    deleteMutation.mutate(entry.id, {
      onSuccess: () => toast.success("Aktivite kaydı silindi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
      <div>
        <p className="font-medium text-stone-800">{activityTypeLabels[entry.activityType]}</p>
        <p className="text-xs text-stone-500">{entry.steps} adım · {entry.distanceKm} km · {entry.durationMinutes} dk · {entry.caloriesBurned} kcal</p>
        {entry.note ? <p className="mt-1 text-xs text-stone-500">{entry.note}</p> : null}
      </div>
      <button type="button" onClick={handleDelete} disabled={deleteMutation.isPending} aria-label="Aktivite kaydını sil" className="grid h-9 w-9 place-items-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
        <Trash2 size={17} />
      </button>
    </div>
  );
}
