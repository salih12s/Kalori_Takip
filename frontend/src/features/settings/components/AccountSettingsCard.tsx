import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { routePaths } from "../../../app/router/routes";
import { secondaryButtonClassName } from "../../../lib/ui";
import { useAuth } from "../../auth/hooks/useAuth";

export function AccountSettingsCard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(routePaths.login, { replace: true });
  };

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div>
        <h2 className="text-base font-semibold text-stone-900">Hesap</h2>
        <p className="text-sm text-stone-500">Oturum bilgilerin ve çıkış.</p>
      </div>

      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2">
          <dt className="text-sm text-stone-500">Kullanıcı adı</dt>
          <dd className="text-sm font-medium text-stone-900">{user?.username ?? "—"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2">
          <dt className="text-sm text-stone-500">E-posta</dt>
          <dd className="truncate text-sm font-medium text-stone-900">{user?.email ?? "—"}</dd>
        </div>
      </dl>

      <button type="button" onClick={handleLogout} className={`${secondaryButtonClassName} w-full sm:w-auto`}>
        <LogOut size={16} />
        Çıkış Yap
      </button>
    </section>
  );
}
