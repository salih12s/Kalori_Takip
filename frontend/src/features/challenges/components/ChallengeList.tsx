import { EmptyState } from "../../../components/shared/EmptyState";
import type { Challenge } from "../types/challenge.types";
import { ChallengeCard } from "./ChallengeCard";

interface ChallengeListProps {
  challenges: Challenge[];
  onViewMembers: (challengeId: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ChallengeList({
  challenges,
  onViewMembers,
  emptyTitle = "Henüz challenge yok",
  emptyDescription = "İlk challenge'ı oluşturarak başla.",
}: ChallengeListProps) {
  if (challenges.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} onViewMembers={onViewMembers} />
      ))}
    </div>
  );
}
