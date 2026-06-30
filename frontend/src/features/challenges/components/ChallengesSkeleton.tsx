export function ChallengesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" role="status" aria-live="polite">
      <span className="sr-only">Challenge verileri yükleniyor...</span>
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div className="h-5 w-2/3 animate-pulse rounded bg-stone-100" />
          <div className="h-4 w-full animate-pulse rounded bg-stone-100" />
          <div className="h-10 animate-pulse rounded-lg bg-stone-100" />
          <div className="h-8 w-1/2 animate-pulse rounded-lg bg-stone-100" />
        </div>
      ))}
    </div>
  );
}
