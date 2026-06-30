import { Activity, Flame, Footprints, Trophy } from "lucide-react";

import { PageShell } from "../../../components/layout/PageShell";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { StatCard } from "../../../components/shared/StatCard";

/**
 * Placeholder dashboard. Cards show neutral values only — no backend data yet.
 */
export function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        description="Bugünkü kalori, aktivite ve hedef durumunu buradan takip et."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Bugünkü Kalori" value="—" suffix="kcal" icon={Flame} />
        <StatCard title="Kalan Kalori" value="—" suffix="kcal" icon={Activity} />
        <StatCard title="Adım" value="—" icon={Footprints} />
        <StatCard title="Haftalık Sıralama" value="—" icon={Trophy} />
      </div>

      <EmptyState
        title="Veriler henüz bağlı değil"
        description="Dashboard gerçek verilerle ileriki bir adımda doldurulacak. Şimdilik temel düzen hazır."
      />
    </PageShell>
  );
}
