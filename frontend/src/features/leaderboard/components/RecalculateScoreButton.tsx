import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { primaryButtonClassName } from "../../../lib/ui";
import { useRecalculateScore } from "../hooks/useRecalculateScore";

export function RecalculateScoreButton() {
  const recalculateMutation = useRecalculateScore();

  const handleRecalculate = () => {
    recalculateMutation.mutate(undefined, {
      onSuccess: () => toast.success("Puanın güncellendi."),
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
      {recalculateMutation.isPending ? "Güncelleniyor..." : "Puanı Güncelle"}
    </button>
  );
}
