import { EmptyState } from "../../../components/shared/EmptyState";
import type { EarnedBadge } from "../types/gamification.types";
import { formatShortDate, getBadgeIcon } from "../utils/gamification-labels";

interface RecentBadgesProps {
  badges: EarnedBadge[];
}

export function RecentBadges({ badges }: RecentBadgesProps) {
  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Son Kazanılan Rozetler</h2>

      {badges.length === 0 ? (
        <EmptyState title="Henüz rozet kazanmadın." description="İlk rozetini kazanmak için kayıt eklemeye başla." />
      ) : (
        <ul className="space-y-2">
          {badges.map((badge) => {
            const Icon = getBadgeIcon(badge.icon);
            return (
              <li
                key={badge.id}
                className="flex items-center gap-3 rounded-lg border border-stone-200 p-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-900">{badge.title}</p>
                  <p className="truncate text-xs text-stone-500">{badge.description}</p>
                </div>
                <span className="shrink-0 text-xs text-stone-400">{formatShortDate(badge.earnedAt)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
