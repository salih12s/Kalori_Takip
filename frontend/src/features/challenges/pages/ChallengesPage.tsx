import { Plus } from "lucide-react";
import { useState } from "react";

import { PageShell } from "../../../components/layout/PageShell";
import { ErrorState } from "../../../components/shared/ErrorState";
import { PageHeader } from "../../../components/shared/PageHeader";
import { primaryButtonClassName } from "../../../lib/ui";
import { ChallengeList } from "../components/ChallengeList";
import { ChallengeMembersDialog } from "../components/ChallengeMembersDialog";
import { ChallengesSkeleton } from "../components/ChallengesSkeleton";
import { CreateChallengeDialog } from "../components/CreateChallengeDialog";
import { MyChallengesSection } from "../components/MyChallengesSection";
import { useChallenges } from "../hooks/useChallenges";

export function ChallengesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [membersChallengeId, setMembersChallengeId] = useState<string | null>(null);
  const challengesQuery = useChallenges();

  return (
    <PageShell>
      <PageHeader
        title="Meydan Okuma"
        description="Arkadaşlarınla hedef belirle, katıl ve ilerlemeni takip et."
        action={
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className={`${primaryButtonClassName} sm:w-auto`}
          >
            <Plus size={16} />
            Yeni Challenge
          </button>
        }
      />

      <MyChallengesSection onViewMembers={setMembersChallengeId} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">Aktif Challenge'lar</h2>

        {challengesQuery.isLoading ? (
          <ChallengesSkeleton />
        ) : challengesQuery.isError ? (
          <ErrorState
            title="Challenge verileri alınamadı."
            description="Lütfen tekrar dene."
            onRetry={() => void challengesQuery.refetch()}
          />
        ) : (
          <ChallengeList
            challenges={challengesQuery.data ?? []}
            onViewMembers={setMembersChallengeId}
            emptyTitle="Aktif challenge bulunmuyor."
            emptyDescription="İlk challenge'ı oluşturarak topluluğu başlat."
          />
        )}
      </section>

      <CreateChallengeDialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      <ChallengeMembersDialog
        challengeId={membersChallengeId}
        onClose={() => setMembersChallengeId(null)}
      />
    </PageShell>
  );
}
