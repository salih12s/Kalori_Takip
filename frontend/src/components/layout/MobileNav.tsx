import { NavLink } from "react-router-dom";

import { navItems } from "../../app/router/routes";
import { cn } from "../../lib/cn";

/**
 * Bottom navigation for mobile. Uses a fixed 9-column grid so it never
 * overflows or shifts layout on small screens.
 */
export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-9 border-t border-stone-200 bg-white/95 backdrop-blur lg:hidden">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors",
              isActive ? "text-emerald-600" : "text-stone-500"
            )
          }
        >
          <Icon size={18} />
          <span className="w-full truncate text-center leading-tight">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
