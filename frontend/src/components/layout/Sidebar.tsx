import { NavLink } from "react-router-dom";

import { navItems } from "../../app/router/routes";
import { AppLogo } from "../branding/AppLogo";
import { cn } from "../../lib/cn";

/**
 * Desktop sidebar. Hidden on mobile, where MobileNav takes over.
 */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-stone-200 px-6 dark:border-stone-800">
        <AppLogo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-50"
              )
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-stone-200 px-6 py-4 dark:border-stone-800">
        <p className="text-xs text-stone-400">Saydam Fitness · Sağlıklı rekabet</p>
      </div>
    </aside>
  );
}
