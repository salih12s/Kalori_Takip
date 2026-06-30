export function LeaderboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Liderlik tablosu yükleniyor...</span>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-24 animate-pulse rounded-xl border border-stone-200 bg-stone-100"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-stone-200 bg-stone-100" />
    </div>
  );
}
