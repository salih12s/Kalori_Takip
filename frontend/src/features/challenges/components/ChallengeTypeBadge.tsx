import type { ChallengeType } from "../types/challenge.types";
import { challengeTypeLabels } from "../utils/challenge-labels";

export function ChallengeTypeBadge({ type }: { type: ChallengeType }) {
  return (
    <span className="inline-flex shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      {challengeTypeLabels[type]}
    </span>
  );
}
