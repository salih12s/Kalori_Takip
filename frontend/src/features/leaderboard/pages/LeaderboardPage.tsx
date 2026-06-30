import { Trophy } from "lucide-react";

import { PageShell } from "../../../components/layout/PageShell";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";

/**
 * Placeholder leaderboard page. Ranking data is wired in a later phase.
 */
export function LeaderboardPage() {
  return (
    <PageShell>
      <PageHeader
        title="Liderlik Tablosu"
        description="Arkadaşlarınla haftalık ilerlemeni karşılaştır."
      />

      <EmptyState
        icon={Trophy}
        title="Sıralama henüz hazır değil"
        description="Arkadaşlarınla haftalık ve aylık sıralaman burada görünecek. Bu sayfa ileriki bir adımda aktif olacak."
      />
    </PageShell>
  );
}
