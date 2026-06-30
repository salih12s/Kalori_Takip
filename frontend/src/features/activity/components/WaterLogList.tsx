import { Droplets, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "../../../components/shared/EmptyState";
import { getApiErrorMessage } from "../../../lib/api";
import { useDeleteWaterLog } from "../hooks/useDeleteWaterLog";
import type { WaterLogResponse } from "../types/activity.types";

export function WaterLogList({ waterLogs, date }: { waterLogs: WaterLogResponse[]; date: string }) {
  const deleteMutation = useDeleteWaterLog(date);

  const handleDelete = (waterLogId: string) => {
    deleteMutation.mutate(waterLogId, {
      onSuccess: () => toast.success("Su kaydı silindi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Su Kayıtları</h2>
      <div className="mt-4 space-y-3">
        {waterLogs.length === 0 ? (
          <EmptyState icon={Droplets} title="Bugün henüz su kaydı yok." />
        ) : (
          waterLogs.map((log) => (
            <div key={log.id} className="flex items-center justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50 px-4 py-3">
              <div>
                <p className="font-medium text-stone-800">{log.amountMl} ml</p>
                <p className="text-xs text-stone-500">{new Date(log.createdAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <button type="button" onClick={() => handleDelete(log.id)} disabled={deleteMutation.isPending} aria-label="Su kaydını sil" className="grid h-9 w-9 place-items-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50">
                <Trash2 size={17} />
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
