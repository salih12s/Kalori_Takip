interface ChallengeProgressBarProps {
  progress: number;
  target: number;
  unit: string;
}

export function ChallengeProgressBar({ progress, target, unit }: ChallengeProgressBarProps) {
  const ratio = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          {progress} / {target} {unit}
        </span>
        <span>%{ratio}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${ratio}%` }} />
      </div>
    </div>
  );
}
