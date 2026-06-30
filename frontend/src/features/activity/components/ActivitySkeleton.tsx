import { LoadingState } from "../../../components/shared/LoadingState";

export function ActivitySkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Aktivite yükleniyor...</span>
      <div className="h-16 max-w-2xl animate-pulse rounded-xl bg-stone-100" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-32 animate-pulse rounded-xl border border-stone-200 bg-stone-100" />)}
      </div>
      <LoadingState rows={4} />
    </div>
  );
}
