import { Activity } from "lucide-react";

import { PageShell } from "../../../components/layout/PageShell";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";

/**
 * Placeholder activity page. Step/workout tracking arrives in a later phase.
 */
export function ActivityPage() {
  return (
    <PageShell>
      <PageHeader
        title="Aktivite"
        description="Adım, koşu, yürüyüş, spor ve dinlenme günlerini takip et."
      />

      <EmptyState
        icon={Activity}
        title="Aktivite kaydı bulunmuyor"
        description="Adım, koşu veya antrenman verilerin burada görünecek. Bu sayfa ileriki bir adımda aktif olacak."
      />
    </PageShell>
  );
}
