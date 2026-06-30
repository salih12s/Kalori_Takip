import { Bell, Flame } from "lucide-react";

/**
 * Top header bar. Shows branding on mobile (where the sidebar is hidden)
 * and a placeholder user/avatar area. Real auth state is wired in a later phase.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-stone-200 bg-white/95 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-2 lg:hidden">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white">
          <Flame size={16} />
        </span>
        <span className="text-base font-bold tracking-tight text-stone-900">FitBoard</span>
      </div>

      <p className="hidden text-sm font-medium text-stone-400 lg:block">
        Sağlıklı alışkanlıklarını takip et
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Bildirimler"
          className="grid h-9 w-9 place-items-center rounded-lg text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
            FB
          </span>
          <span className="hidden text-sm font-medium text-stone-700 sm:block">Misafir</span>
        </div>
      </div>
    </header>
  );
}
