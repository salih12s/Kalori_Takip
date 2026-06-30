import { ErrorState } from "../../../components/shared/ErrorState";
import { EmptyState } from "../../../components/shared/EmptyState";
import { useFollowRequests } from "../hooks/useFollowRequests";
import { FollowRequestItem } from "./FollowRequestItem";

export function FollowRequestsPanel() {
  const requestsQuery = useFollowRequests();
  const requests = requestsQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Gelen İstekler</h2>

      {requestsQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      ) : requestsQuery.isError ? (
        <ErrorState
          title="İstekler alınamadı."
          description="Lütfen tekrar dene."
          onRetry={() => void requestsQuery.refetch()}
        />
      ) : requests.length === 0 ? (
        <EmptyState title="Bekleyen takip isteği yok." />
      ) : (
        <div className="space-y-2">
          {requests.map((request) => (
            <FollowRequestItem key={request.follow.id} request={request} />
          ))}
        </div>
      )}
    </section>
  );
}
