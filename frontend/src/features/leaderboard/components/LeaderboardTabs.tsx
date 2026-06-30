import { cn } from "../../../lib/cn";

export type LeaderboardTab = "weekly" | "monthly" | "friends";

interface LeaderboardTabsProps {
  active: LeaderboardTab;
  onChange: (tab: LeaderboardTab) => void;
}

const tabs: { id: LeaderboardTab; label: string }[] = [
  { id: "weekly", label: "Haftalık" },
  { id: "monthly", label: "Aylık" },
  { id: "friends", label: "Arkadaşlar" },
];

export function LeaderboardTabs({ active, onChange }: LeaderboardTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            active === tab.id
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
