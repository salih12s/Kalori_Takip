export function SettingsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite">
      <span className="sr-only">Ayarlar yükleniyor...</span>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
        >
          <div className="h-5 w-40 animate-pulse rounded bg-stone-100" />
          <div className="h-10 animate-pulse rounded-lg bg-stone-100" />
          <div className="h-10 animate-pulse rounded-lg bg-stone-100" />
        </div>
      ))}
    </div>
  );
}
