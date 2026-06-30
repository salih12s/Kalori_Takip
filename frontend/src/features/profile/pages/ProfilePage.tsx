import { User } from "lucide-react";

import { PageShell } from "../../../components/layout/PageShell";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";

/**
 * Placeholder profile page. Personal info and goals are wired in a later phase.
 */
export function ProfilePage() {
  return (
    <PageShell>
      <PageHeader
        title="Profil"
        description="Kişisel bilgilerini ve hedeflerini burada yöneteceksin."
      />

      <EmptyState
        icon={User}
        title="Profil bilgileri henüz hazır değil"
        description="Kişisel bilgilerin ve hedeflerin burada düzenlenebilecek. Bu sayfa ileriki bir adımda aktif olacak."
      />
    </PageShell>
  );
}
