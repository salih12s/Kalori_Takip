import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ErrorState } from "../../../components/shared/ErrorState";
import { getApiErrorMessage } from "../../../lib/api";
import { secondaryButtonClassName } from "../../../lib/ui";
import { useMyChallenges } from "../hooks/useMyChallenges";
import { useRecalculateAllChallenges } from "../hooks/useRecalculateAllChallenges";
import { ChallengeList } from "./ChallengeList";
import { ChallengesSkeleton } from "./ChallengesSkeleton";

interface MyChallengesSectionProps {
  onViewMembers: (challengeId: string) => void;
}

export function MyChallengesSection({ onViewMembers }: MyChallengesSectionProps) {
  const myChallengesQuery = useMyChallenges();
  const recalcAllMutation = useRecalculateAllChallenges();

  const handleRecalculateAll = () =>
    recalcAllMutation.mutate(undefined, {
      onSuccess: () => toast.success("İlerlemen güncellendi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stone-900">Benim Challenge'larım</h2>
        <button
          type="button"
          onClick={handleRecalculateAll}
          disabled={recalcAllMutation.isPending}
          className={`${secondaryButtonClassName} w-full sm:w-auto`}
        >
          <RefreshCw size={16} className={recalcAllMutation.isPending ? "animate-spin" : undefined} />
          Tümünü Güncelle
        </button>
      </div>

      {myChallengesQuery.isLoading ? (
        <ChallengesSkeleton />
      ) : myChallengesQuery.isError ? (
        <ErrorState
          title="Challenge verileri alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => void myChallengesQuery.refetch()}
        />
      ) : (
        <ChallengeList
          challenges={myChallengesQuery.data ?? []}
          onViewMembers={onViewMembers}
          emptyTitle="Henüz bir challenge'a katılmadın."
          emptyDescription="Aşağıdan bir challenge'a katıl veya yeni bir tane oluştur."
        />
      )}
    </section>
  );
}
