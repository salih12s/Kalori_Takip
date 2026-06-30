import { EmptyState } from "../../../components/shared/EmptyState";
import { useMyLeaderboardSummary } from "../hooks/useMyLeaderboardSummary";
import { pointSourceLabel } from "../utils/leaderboard-labels";

export function PointsBreakdownCard() {
  const summaryQuery = useMyLeaderboardSummary();
  const points = summaryQuery.data?.pointsBreakdown ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-stone-900">Bugünkü Puan Dağılımı</h2>
        <p className="text-sm text-stone-500">Puanın hangi aktivitelerden geldiğini gör.</p>
      </div>

      {summaryQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      ) : points.length === 0 ? (
        <EmptyState
          title="Bugün için puan yok"
          description="Yemek, aktivite veya su ekledikçe puanların burada görünecek."
        />
      ) : (
        <ul className="space-y-2">
          {points.map((point) => (
            <li
              key={point.source}
              className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-stone-800">
                  {pointSourceLabel(point.source)}
                </p>
                {point.description ? (
                  <p className="truncate text-xs text-stone-500">{point.description}</p>
                ) : null}
              </div>
              <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
                +{point.score}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
