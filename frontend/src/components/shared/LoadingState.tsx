interface LoadingStateProps {
  label?: string;
  /** Number of skeleton rows to render. */
  rows?: number;
}

/**
 * Lightweight skeleton placeholder for data that is still loading.
 */
export function LoadingState({ label = "Yükleniyor...", rows = 3 }: LoadingStateProps) {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-16 w-full animate-pulse rounded-xl border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-800"
        />
      ))}
    </div>
  );
}
