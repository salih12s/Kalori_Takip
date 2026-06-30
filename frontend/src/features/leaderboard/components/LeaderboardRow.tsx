import { cn } from "../../../lib/cn";
import type { LeaderboardRow as LeaderboardRowData } from "../types/leaderboard.types";
import { LeaderboardFollowButton } from "./LeaderboardFollowButton";

interface LeaderboardRowProps {
  row: LeaderboardRowData;
  isCurrentUser: boolean;
}

export function LeaderboardRow({ row, isCurrentUser }: LeaderboardRowProps) {
  return (
    <tr className={cn("border-t border-stone-100", isCurrentUser && "bg-emerald-50")}>
      <td className="px-3 py-3 text-sm font-semibold text-stone-700">{row.rank}</td>
      <td className="px-3 py-3">
        <p className="text-sm font-semibold text-stone-900">
          {row.user.username}
          {isCurrentUser ? <span className="ml-1 text-xs text-emerald-600">(Sen)</span> : null}
        </p>
        {row.user.fullName ? (
          <p className="text-xs text-stone-500">{row.user.fullName}</p>
        ) : null}
      </td>
      <td className="px-3 py-3 text-sm font-semibold text-stone-900">{row.totalScore}</td>
      <td className="px-3 py-3 text-sm text-stone-600">{row.totalSteps}</td>
      <td className="px-3 py-3 text-sm text-stone-600">{row.workoutDays}</td>
      <td className="px-3 py-3 text-sm text-stone-600">{row.loggedDays}</td>
      <td className="px-3 py-3">
        <LeaderboardFollowButton userId={row.user.id} status={row.followStatus} />
      </td>
    </tr>
  );
}
