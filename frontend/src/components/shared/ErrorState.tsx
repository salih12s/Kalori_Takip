import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Standard error block with Turkish defaults and an optional retry action.
 */
export function ErrorState({
  title = "Bir şeyler ters gitti",
  description = "İçerik yüklenirken bir hata oluştu. Lütfen tekrar dene.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/60 px-6 py-12 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle size={22} />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-red-700">{title}</h3>
        <p className="mx-auto max-w-md text-sm text-red-600/80">{description}</p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
        >
          Tekrar Dene
        </button>
      ) : null}
    </div>
  );
}
