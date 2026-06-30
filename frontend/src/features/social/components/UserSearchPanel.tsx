import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState } from "../../../components/shared/EmptyState";
import { ErrorState } from "../../../components/shared/ErrorState";
import { inputClassName } from "../../../lib/ui";
import { useUserSearch } from "../hooks/useUserSearch";
import { UserSearchResultItem } from "./UserSearchResultItem";

interface UserSearchPanelProps {
  onViewProfile: (userId: string) => void;
}

export function UserSearchPanel({ onViewProfile }: UserSearchPanelProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const searchQuery = useUserSearch(debouncedQuery);
  const hasQuery = debouncedQuery.length > 0;
  const results = searchQuery.data ?? [];

  return (
    <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-stone-900">Kullanıcı Ara</h2>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Kullanıcı ara..."
          className={`${inputClassName} pl-9`}
        />
      </div>

      {!hasQuery ? (
        <EmptyState
          icon={Search}
          title="Arkadaşlarını bul"
          description="Kullanıcı adıyla arayarak takip etmek istediğin kişileri bul."
        />
      ) : searchQuery.isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-16 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      ) : searchQuery.isError ? (
        <ErrorState
          title="Arama yapılamadı."
          description="Lütfen tekrar dene."
          onRetry={() => void searchQuery.refetch()}
        />
      ) : results.length === 0 ? (
        <EmptyState title="Sonuç bulunamadı" description="Farklı bir kullanıcı adı dene." />
      ) : (
        <div className="space-y-2">
          {results.map((user) => (
            <UserSearchResultItem
              key={user.userId}
              user={user}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      )}
    </section>
  );
}
