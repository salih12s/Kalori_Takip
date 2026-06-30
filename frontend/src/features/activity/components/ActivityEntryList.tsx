import { Activity } from "lucide-react";

import { EmptyState } from "../../../components/shared/EmptyState";
import type { ActivityEntryResponse } from "../types/activity.types";
import { ActivityEntryItem } from "./ActivityEntryItem";

export function ActivityEntryList({ activities, date }: { activities: ActivityEntryResponse[]; date: string }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">Aktivite Kayıtları</h2>
      <div className="mt-4 space-y-3">
        {activities.length === 0 ? (
          <EmptyState icon={Activity} title="Bugün henüz aktivite eklenmedi." description="Koşu, yürüyüş veya adım kaydı ekleyerek başlayabilirsin." />
        ) : (
          activities.map((entry) => <ActivityEntryItem key={entry.id} entry={entry} date={date} />)
        )}
      </div>
    </section>
  );
}
