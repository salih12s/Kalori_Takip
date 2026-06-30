import { Settings } from "lucide-react";

import { PageShell } from "../../../components/layout/PageShell";
import { EmptyState } from "../../../components/shared/EmptyState";
import { PageHeader } from "../../../components/shared/PageHeader";

/**
 * Placeholder settings page. App preferences arrive in a later phase.
 */
export function SettingsPage() {
  return (
    <PageShell>
      <PageHeader
        title="Ayarlar"
        description="Uygulama tercihlerini buradan düzenle."
      />

      <EmptyState
        icon={Settings}
        title="Ayarlar henüz hazır değil"
        description="Uygulama tercihlerin burada yer alacak. Bu sayfa ileriki bir adımda aktif olacak."
      />
    </PageShell>
  );
}
