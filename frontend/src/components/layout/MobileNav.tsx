import { MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { navItems } from "../../app/router/routes";
import { cn } from "../../lib/cn";

const PRIMARY_COUNT = 4;
const primaryItems = navItems.slice(0, PRIMARY_COUNT);
const moreItems = navItems.slice(PRIMARY_COUNT);

/**
 * Bottom navigation for mobile. Shows the 4 most-used destinations directly
 * plus a "Diğer" overflow sheet for the rest, so columns stay wide enough to
 * tap comfortably on narrow phones instead of squeezing all 8 items in.
 */
export function MobileNav() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const location = useLocation();
  const isMoreActive = moreItems.some((item) => location.pathname.startsWith(item.to));

  return (
    <>
      {isMoreOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          onClick={() => setIsMoreOpen(false)}
          className="fixed inset-0 z-30 bg-stone-900/30 lg:hidden"
        />
      ) : null}

      {isMoreOpen ? (
        <div className="fixed inset-x-0 bottom-16 z-30 mx-3 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg dark:border-stone-800 dark:bg-stone-900 lg:hidden">
          <div className="flex items-center justify-between px-2 pb-2">
            <span className="text-sm font-semibold text-stone-700 dark:text-stone-200">Diğer</span>
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setIsMoreOpen(false)}
              className="rounded-full p-1 text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {moreItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "text-stone-600 hover:bg-stone-50 dark:text-stone-300 dark:hover:bg-stone-800"
                  )
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-stone-200 bg-white/95 backdrop-blur dark:border-stone-800 dark:bg-stone-900/95 lg:hidden">
        {primaryItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors",
                isActive ? "text-emerald-600 dark:text-emerald-300" : "text-stone-500 dark:text-stone-300"
              )
            }
          >
            <Icon size={20} />
            <span className="w-full truncate text-center leading-tight">{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setIsMoreOpen((prev) => !prev)}
          aria-expanded={isMoreOpen}
          className={cn(
            "flex flex-col items-center gap-1 px-1 py-2 text-[11px] font-medium transition-colors",
            isMoreActive || isMoreOpen ? "text-emerald-600 dark:text-emerald-300" : "text-stone-500 dark:text-stone-300"
          )}
        >
          <MoreHorizontal size={20} />
          <span className="w-full truncate text-center leading-tight">Diğer</span>
        </button>
      </nav>
    </>
  );
}
