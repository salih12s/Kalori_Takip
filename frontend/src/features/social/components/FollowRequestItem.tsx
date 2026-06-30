import { toast } from "sonner";

import { getApiErrorMessage } from "../../../lib/api";
import { useAcceptFollowRequest } from "../hooks/useAcceptFollowRequest";
import { useRejectFollowRequest } from "../hooks/useRejectFollowRequest";
import type { FollowRequest } from "../types/social.types";
import { getInitials } from "../utils/social-labels";

interface FollowRequestItemProps {
  request: FollowRequest;
}

export function FollowRequestItem({ request }: FollowRequestItemProps) {
  const acceptMutation = useAcceptFollowRequest();
  const rejectMutation = useRejectFollowRequest();
  const isBusy = acceptMutation.isPending || rejectMutation.isPending;

  const handleAccept = () => {
    acceptMutation.mutate(request.follow.id, {
      onSuccess: () => toast.success("Takip isteği kabul edildi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  const handleReject = () => {
    rejectMutation.mutate(request.follow.id, {
      onSuccess: () => toast.success("Takip isteği reddedildi."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
        {getInitials(request.user.username)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-stone-900">{request.user.username}</p>
        <p className="truncate text-xs text-stone-500">
          {request.user.fullName ?? "İsim belirtilmemiş"}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAccept}
        disabled={isBusy}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
      >
        Kabul Et
      </button>
      <button
        type="button"
        onClick={handleReject}
        disabled={isBusy}
        className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50 disabled:opacity-60"
      >
        Reddet
      </button>
    </div>
  );
}
