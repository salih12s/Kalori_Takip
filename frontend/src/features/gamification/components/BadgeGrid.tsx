import { EmptyState } from "../../../components/shared/EmptyState";
import type { BadgeWithEarned } from "../types/gamification.types";
import { BadgeCard } from "./BadgeCard";

interface BadgeGridProps {
  badges: BadgeWithEarned[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-stone-900">Tüm Rozetler</h2>

      {badges.length === 0 ? (
        <EmptyState title="Rozet bulunamadı." description="Rozetler birazdan hazır olacak." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {badges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      )}
    </section>
  );
}
