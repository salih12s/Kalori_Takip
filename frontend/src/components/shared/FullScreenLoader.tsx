import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
  label?: string;
}

/**
 * Centered full-viewport loader used while auth/onboarding state resolves.
 */
export function FullScreenLoader({ label = "Yükleniyor..." }: FullScreenLoaderProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-stone-50">
      <div className="flex items-center gap-2 text-sm font-medium text-stone-500">
        <Loader2 size={18} className="animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}
