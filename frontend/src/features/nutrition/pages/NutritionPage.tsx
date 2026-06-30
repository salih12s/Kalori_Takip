import { Utensils } from "lucide-react";

import { PageShell } from "../../../components/layout/PageShell";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";

/**
 * Placeholder nutrition page. Meal logging is implemented in a later phase.
 */
export function NutritionPage() {
  return (
    <PageShell>
      <PageHeader
        title="Yemek Günlüğü"
        description="Öğünlerini ve günlük kalori takibini buradan yöneteceksin."
      />

      <EmptyState
        icon={Utensils}
        title="Bugün henüz yemek eklemedin"
        description="İlk öğününü ekleyerek takibe başla. Bu sayfa ileriki bir adımda aktif olacak."
      />
    </PageShell>
  );
}
