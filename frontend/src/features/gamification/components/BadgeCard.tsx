import { cn } from "../../../lib/cn";
import type { BadgeWithEarned } from "../types/gamification.types";
import { categoryLabels, formatShortDate, getBadgeIcon } from "../utils/gamification-labels";

interface BadgeCardProps {
  badge: BadgeWithEarned;
}

export function BadgeCard({ badge }: BadgeCardProps) {
  const Icon = getBadgeIcon(badge.icon);
  const { isEarned } = badge;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 shadow-sm",
        isEarned ? "border-emerald-200 bg-white" : "border-stone-200 bg-stone-50"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
            isEarned ? "bg-emerald-50 text-emerald-600" : "bg-stone-200 text-stone-400"
          )}
        >
          <Icon size={20} />
        </span>

        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", isEarned ? "text-stone-900" : "text-stone-500")}>
            {badge.title}
          </p>
          <p className="text-xs text-stone-500">{categoryLabels[badge.category]}</p>
        </div>

        <span
          className={cn(
            "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
            isEarned ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 text-stone-500"
          )}
        >
          {isEarned ? "Kazanıldı" : "Kilitli"}
        </span>
      </div>

      <p className="mt-2 text-xs text-stone-500">{badge.description}</p>

      {isEarned && badge.earnedAt ? (
        <p className="mt-2 text-[11px] text-stone-400">
          Kazanma Tarihi: {formatShortDate(badge.earnedAt)}
        </p>
      ) : null}
    </div>
  );
}
