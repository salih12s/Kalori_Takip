import { PageShell } from "../../../components/layout/PageShell";
import { PageHeader } from "../../../components/shared/PageHeader";
import { useAuth } from "../../auth/hooks/useAuth";
import { AccountSettingsCard } from "../components/AccountSettingsCard";
import { AppPreferencesCard } from "../components/AppPreferencesCard";
import { SettingsSkeleton } from "../components/SettingsSkeleton";

export function SettingsPage() {
  const { isLoading } = useAuth();

  return (
    <PageShell>
      <PageHeader
        title="Ayarlar"
        description="Uygulama tercihlerini ve hesap ayarlarını buradan yönet."
      />

      {isLoading ? (
        <SettingsSkeleton />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <AccountSettingsCard />
          <AppPreferencesCard />
        </div>
      )}
    </PageShell>
  );
}
