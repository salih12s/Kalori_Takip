import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "../../lib/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  description?: string;
  /** Optional progress ratio in the 0-100 range. */
  progress?: number;
  icon?: LucideIcon;
}

/**
 * Reusable metric card for dashboards.
 * Renders only what it is given — no real data is wired in Phase 8.
 */
export function StatCard({
  title,
  value,
  suffix,
  description,
  progress,
  icon: Icon,
}: StatCardProps) {
  const clampedProgress =
    typeof progress === "number" ? Math.max(0, Math.min(100, progress)) : null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-stone-500">{title}</p>
        {Icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon size={18} />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-2xl font-bold text-stone-900">{value}</span>
        {suffix ? <span className="text-sm text-stone-400">{suffix}</span> : null}
      </div>

      {description ? (
        <p className="mt-1 text-xs text-stone-400">{description}</p>
      ) : null}

      {clampedProgress !== null ? (
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className={cn("h-full rounded-full bg-emerald-500 transition-all")}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      ) : null}
    </motion.div>
  );
}
