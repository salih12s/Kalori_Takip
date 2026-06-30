import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

/**
 * Friendly empty placeholder. Turkish copy is supplied by the caller.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-stone-200 bg-white px-6 py-14 text-center dark:border-stone-700 dark:bg-stone-900">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-300">
        <Icon size={22} />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-stone-800 dark:text-stone-50">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-md text-sm text-stone-500">{description}</p>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
