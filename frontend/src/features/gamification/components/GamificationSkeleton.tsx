export function GamificationSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Rozet verileri yükleniyor...</span>
      <div className="h-28 animate-pulse rounded-xl border border-stone-200 bg-stone-100" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-xl border border-stone-200 bg-stone-100" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-xl border border-stone-200 bg-stone-100" />
        ))}
      </div>
    </div>
  );
}
