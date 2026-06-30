import { ErrorState } from "../../../components/shared/ErrorState";
import { EmptyState } from "../../../components/shared/EmptyState";
import { useFollowers } from "../hooks/useFollowers";
import { getInitials } from "../utils/social-labels";

interface FollowersListProps {
  onViewProfile: (userId: string) => void;
}

export function FollowersList({ onViewProfile }: FollowersListProps) {
  const followersQuery = useFollowers();
  const followers = followersQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Takipçiler</h2>

      {followersQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      ) : followersQuery.isError ? (
        <ErrorState
          title="Takipçi verileri alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => void followersQuery.refetch()}
        />
      ) : followers.length === 0 ? (
        <EmptyState title="Henüz takipçin yok." />
      ) : (
        <div className="space-y-2">
          {followers.map((follower) => (
            <div
              key={follower.userId}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-200 p-3"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-stone-200 text-sm font-semibold text-stone-600">
                {getInitials(follower.username)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-900">{follower.username}</p>
                <p className="truncate text-xs text-stone-500">
                  {follower.fullName ?? "İsim belirtilmemiş"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onViewProfile(follower.userId)}
                className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                Profil Gör
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
