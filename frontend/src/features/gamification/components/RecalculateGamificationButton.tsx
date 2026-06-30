import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { primaryButtonClassName } from "../../../lib/ui";
import { useRecalculateGamification } from "../hooks/useRecalculateGamification";

export function RecalculateGamificationButton() {
  const recalculateMutation = useRecalculateGamification();

  const handleRecalculate = () => {
    recalculateMutation.mutate(undefined, {
      onSuccess: (result) => {
        toast.success(
          result.newlyAwardedBadges.length > 0 ? "Yeni rozet kazandın!" : "Rozetlerin güncellendi."
        );
      },
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <button
      type="button"
      onClick={handleRecalculate}
      disabled={recalculateMutation.isPending}
      className={`${primaryButtonClassName} sm:w-auto`}
    >
      <RefreshCw size={16} className={recalculateMutation.isPending ? "animate-spin" : undefined} />
      {recalculateMutation.isPending ? "Güncelleniyor..." : "Rozetleri Güncelle"}
    </button>
  );
}
