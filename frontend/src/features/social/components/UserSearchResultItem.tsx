import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useFollowUser } from "../hooks/useFollowUser";
import type { SafeUserSummary } from "../types/social.types";
import { getInitials, privacyLabels } from "../utils/social-labels";

interface UserSearchResultItemProps {
  user: SafeUserSummary;
  onViewProfile: (userId: string) => void;
}

const followLabels: Record<NonNullable<SafeUserSummary["followStatus"]>, string> = {
  PENDING: "İstek Gönderildi",
  ACCEPTED: "Takip Ediliyor",
  BLOCKED: "Engellendi",
};

export function UserSearchResultItem({ user, onViewProfile }: UserSearchResultItemProps) {
  const followMutation = useFollowUser();
  const status = user.followStatus ?? null;
  const canFollow = status === null;

  const handleFollow = () => {
    followMutation.mutate(user.userId, {
      onSuccess: () => toast.success("Takip isteği gönderildi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
        {getInitials(user.username)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-stone-900">{user.username}</p>
        <p className="truncate text-xs text-stone-500">
          {user.fullName ?? "İsim belirtilmemiş"} · {privacyLabels[user.privacyLevel]}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onViewProfile(user.userId)}
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50"
      >
        Profil Gör
      </button>

      {status === "BLOCKED" ? null : canFollow ? (
        <button
          type="button"
          onClick={handleFollow}
          disabled={followMutation.isPending}
          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {followMutation.isPending ? "Gönderiliyor..." : "Takip Et"}
        </button>
      ) : (
        <span className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-500">
          {followLabels[status]}
        </span>
      )}
    </div>
  );
}
