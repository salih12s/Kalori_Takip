import { useQueryClient } from "@tanstack/react-query";
import { Bell, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { routePaths } from "../../app/router/routes";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useFollowRequests } from "../../features/social/hooks/useFollowRequests";
import { AppLogo } from "../branding/AppLogo";

/**
 * Top header bar. Shows branding on mobile and the current auth user.
 */
export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requestsQuery = useFollowRequests();
  const pendingCount = requestsQuery.data?.length ?? 0;

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate(routePaths.login, { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <AppLogo compact />
        <span className="text-base font-bold tracking-tight text-stone-900">Saydam Fitness</span>
      </div>

      <p className="hidden text-sm font-medium text-stone-400 lg:block">
        Sağlıklı alışkanlıklarını takip et
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Bildirimler"
          title="Bildirimler"
          onClick={() => navigate(routePaths.friends)}
          className="relative grid h-9 w-9 place-items-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <Bell size={18} />
          <AnimatePresence>
            {pendingCount > 0 ? (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-emerald-600 px-1 text-[10px] font-bold text-white"
              >
                {pendingCount}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </button>
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
            {(user?.username ?? "FB").slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden max-w-32 truncate text-sm font-medium text-stone-700 sm:block">
            {user?.username ?? "Profil"}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Çıkış Yap</span>
          </button>
        </div>
      </div>
    </header>
  );
}
