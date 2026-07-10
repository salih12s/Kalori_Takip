interface StatRow {
  label: string;
  value: string;
}

interface CalculatorResultCardProps {
  title: string;
  stats: StatRow[];
  footnote?: string;
}

/** Shared result panel used by each of the five calculator tabs. */
export function CalculatorResultCard({ title, stats, footnote }: CalculatorResultCardProps) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950">
      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">{title}</p>
      <dl className="mt-2 space-y-1.5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-baseline justify-between gap-3">
            <dt className="text-sm text-emerald-800 dark:text-emerald-200">{stat.label}</dt>
            <dd className="text-right text-sm font-semibold text-emerald-950 dark:text-emerald-50">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {footnote ? <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300">{footnote}</p> : null}
    </div>
  );
}
