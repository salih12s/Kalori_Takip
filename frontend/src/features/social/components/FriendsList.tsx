import { ErrorState } from "../../../components/shared/ErrorState";
import { EmptyState } from "../../../components/shared/EmptyState";
import { useFriends } from "../hooks/useFriends";
import { FriendListItem } from "./FriendListItem";

interface FriendsListProps {
  onViewProfile: (userId: string) => void;
}

export function FriendsList({ onViewProfile }: FriendsListProps) {
  const friendsQuery = useFriends();
  const friends = friendsQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Takip Ettiklerim</h2>

      {friendsQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      ) : friendsQuery.isError ? (
        <ErrorState
          title="Arkadaş verileri alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => void friendsQuery.refetch()}
        />
      ) : friends.length === 0 ? (
        <EmptyState
          title="Henüz takip ettiğin kimse yok."
          description="Yukarıdan kullanıcı arayarak takibe başlayabilirsin."
        />
      ) : (
        <div className="space-y-2">
          {friends.map((friend) => (
            <FriendListItem key={friend.userId} friend={friend} onViewProfile={onViewProfile} />
          ))}
        </div>
      )}
    </section>
  );
}
