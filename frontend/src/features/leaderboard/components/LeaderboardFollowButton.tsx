import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useFollowUser } from "../../social/hooks/useFollowUser";
import type { LeaderboardFollowStatus } from "../types/leaderboard.types";

interface LeaderboardFollowButtonProps {
  userId: string;
  status: LeaderboardFollowStatus;
}

const badgeClass = "rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-500";

/** Per-row follow action shown on the global leaderboard. */
export function LeaderboardFollowButton({ userId, status }: LeaderboardFollowButtonProps) {
  const followMutation = useFollowUser();

  if (status === "SELF") {
    return <span className="text-xs text-stone-400">—</span>;
  }

  if (status === "ACCEPTED") {
    return <span className={badgeClass}>Takip Ediliyor</span>;
  }

  if (status === "PENDING") {
    return <span className={badgeClass}>İstek Gönderildi</span>;
  }

  const handleFollow = () => {
    followMutation.mutate(userId, {
      onSuccess: () => toast.success("Takip isteği gönderildi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <button
      type="button"
      onClick={handleFollow}
      disabled={followMutation.isPending}
      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
    >
      {followMutation.isPending ? "Gönderiliyor..." : "Takip Et"}
    </button>
  );
}
