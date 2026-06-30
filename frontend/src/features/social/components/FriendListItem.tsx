import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useUnfollowUser } from "../hooks/useUnfollowUser";
import type { FriendSummary } from "../types/social.types";
import { formatShortDate, getInitials } from "../utils/social-labels";

interface FriendListItemProps {
  friend: FriendSummary;
  onViewProfile: (userId: string) => void;
}

export function FriendListItem({ friend, onViewProfile }: FriendListItemProps) {
  const unfollowMutation = useUnfollowUser();

  const handleUnfollow = () => {
    unfollowMutation.mutate(friend.userId, {
      onSuccess: () => toast.success("Takipten çıkıldı."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
        {getInitials(friend.username)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-stone-900">{friend.username}</p>
        <p className="truncate text-xs text-stone-500">
          {friend.fullName ?? "İsim belirtilmemiş"} · {formatShortDate(friend.followedAt)} tarihinde
          takip edildi
        </p>
      </div>

      <button
        type="button"
        onClick={() => onViewProfile(friend.userId)}
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50"
      >
        Profil Gör
      </button>

      <button
        type="button"
        onClick={handleUnfollow}
        disabled={unfollowMutation.isPending}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {unfollowMutation.isPending ? "Çıkılıyor..." : "Takipten Çık"}
      </button>
    </div>
  );
}
