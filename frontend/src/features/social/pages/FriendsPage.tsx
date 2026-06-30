import { Users } from "lucide-react";

import { PageShell } from "../../../components/layout/PageShell";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";

/**
 * Placeholder friends page. Follow/unfollow flows arrive in a later phase.
 */
export function FriendsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Arkadaşlar"
        description="Arkadaşlarını takip et ve gelişimlerini gör."
      />

      <EmptyState
        icon={Users}
        title="Henüz arkadaşın yok"
        description="Arkadaşlarını bulup takip ettiğinde burada listelenecekler. Bu sayfa ileriki bir adımda aktif olacak."
      />
    </PageShell>
  );
}
