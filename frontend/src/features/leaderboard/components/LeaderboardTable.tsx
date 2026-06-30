import { EmptyState } from "../../../components/shared/EmptyState";
import type { LeaderboardRow as LeaderboardRowData } from "../types/leaderboard.types";
import { LeaderboardRow } from "./LeaderboardRow";

interface LeaderboardTableProps {
  rows: LeaderboardRowData[];
  currentUserId?: string;
}

const columns = ["Sıra", "Kullanıcı", "Puan", "Adım", "Spor Günü", "Kayıtlı Gün"];

export function LeaderboardTable({ rows, currentUserId }: LeaderboardTableProps) {
  if (rows.length === 0) {
    return <EmptyState title="Liderlik tablosunda henüz veri yok." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="bg-stone-50">
            {columns.map((column) => (
              <th
                key={column}
                className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-stone-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <LeaderboardRow
              key={row.user.id}
              row={row}
              isCurrentUser={row.user.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
