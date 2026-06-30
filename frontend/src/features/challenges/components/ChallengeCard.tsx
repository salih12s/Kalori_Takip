import { Users } from "lucide-react";
import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useJoinChallenge } from "../hooks/useJoinChallenge";
import { useLeaveChallenge } from "../hooks/useLeaveChallenge";
import { useRecalculateChallenge } from "../hooks/useRecalculateChallenge";
import type { Challenge } from "../types/challenge.types";
import { formatShortDate } from "../utils/challenge-labels";
import { ChallengeProgressBar } from "./ChallengeProgressBar";
import { ChallengeTypeBadge } from "./ChallengeTypeBadge";

interface ChallengeCardProps {
  challenge: Challenge;
  onViewMembers: (challengeId: string) => void;
}

const primarySmall =
  "rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60";
const dangerSmall =
  "rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60";
const subtleSmall =
  "inline-flex items-center gap-1 rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50";

export function ChallengeCard({ challenge, onViewMembers }: ChallengeCardProps) {
  const joinMutation = useJoinChallenge();
  const leaveMutation = useLeaveChallenge();
  const recalcMutation = useRecalculateChallenge();

  const membership = challenge.currentUserMembership;
  const isCompleted = membership?.status === "COMPLETED";
  const busy = joinMutation.isPending || leaveMutation.isPending || recalcMutation.isPending;

  const handleJoin = () =>
    joinMutation.mutate(challenge.id, {
      onSuccess: () => toast.success("Challenge'a katıldın."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });

  const handleLeave = () =>
    leaveMutation.mutate(challenge.id, {
      onSuccess: () => toast.success("Challenge'dan ayrıldın."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });

  const handleRecalculate = () =>
    recalcMutation.mutate(challenge.id, {
      onSuccess: () => toast.success("İlerlemen güncellendi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-stone-900">{challenge.title}</h3>
          {challenge.description ? (
            <p className="mt-0.5 line-clamp-2 text-sm text-stone-500">{challenge.description}</p>
          ) : null}
        </div>
        <ChallengeTypeBadge type={challenge.type} />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <Detail label="Hedef" value={`${challenge.targetValue} ${challenge.unit}`} />
        <Detail label="Katılımcı" value={String(challenge.memberCount)} />
        <Detail label="Başlangıç" value={formatShortDate(challenge.startsAt)} />
        <Detail label="Bitiş" value={formatShortDate(challenge.endsAt)} />
      </dl>

      {membership ? (
        <ChallengeProgressBar
          progress={membership.progress}
          target={challenge.targetValue}
          unit={challenge.unit}
        />
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        {membership ? (
          <>
            {isCompleted ? (
              <span className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                Tamamlandı
              </span>
            ) : null}
            <button type="button" onClick={handleRecalculate} disabled={busy} className={primarySmall}>
              İlerlemeyi Güncelle
            </button>
            <button type="button" onClick={handleLeave} disabled={busy} className={dangerSmall}>
              Ayrıl
            </button>
          </>
        ) : (
          <button type="button" onClick={handleJoin} disabled={busy} className={primarySmall}>
            Katıl
          </button>
        )}
        <button type="button" onClick={() => onViewMembers(challenge.id)} className={subtleSmall}>
          <Users size={14} />
          Üyeler
        </button>
      </div>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-stone-400">{label}</dt>
      <dd className="font-medium text-stone-700">{value}</dd>
    </div>
  );
}
