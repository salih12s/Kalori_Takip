import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";

import { ErrorState } from "../../../components/shared/ErrorState";
import { challengesApi } from "../api/challenges.api";
import { ChallengeProgressBar } from "./ChallengeProgressBar";

interface ChallengeMembersDialogProps {
  challengeId: string | null;
  onClose: () => void;
}

export function ChallengeMembersDialog({ challengeId, onClose }: ChallengeMembersDialogProps) {
  const detailQuery = useQuery({
    queryKey: ["challenges", "detail", challengeId],
    queryFn: () => challengesApi.getById(challengeId as string),
    enabled: Boolean(challengeId),
  });

  if (!challengeId) return null;

  const challenge = detailQuery.data;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-stone-950/30 px-4 py-6">
      <section className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-stone-900">Katılımcılar</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid h-8 w-8 place-items-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X size={18} />
          </button>
        </div>

        {detailQuery.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-lg bg-stone-100" />
            ))}
          </div>
        ) : detailQuery.isError || !challenge ? (
          <ErrorState
            title="Katılımcılar alınamadı."
            description="Lütfen tekrar dene."
            onRetry={() => void detailQuery.refetch()}
          />
        ) : (
          <ul className="space-y-3">
            {challenge.members.map((member) => (
              <li key={member.userId} className="space-y-1.5 rounded-lg border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-stone-900">{member.username}</p>
                  {member.status === "COMPLETED" ? (
                    <span className="shrink-0 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      Tamamlandı
                    </span>
                  ) : null}
                </div>
                <ChallengeProgressBar
                  progress={member.progress}
                  target={challenge.targetValue}
                  unit={challenge.unit}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
