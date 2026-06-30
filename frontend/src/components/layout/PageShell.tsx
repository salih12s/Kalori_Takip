import type { ReactNode } from "react";

import { cn } from "../../lib/cn";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Consistent content wrapper for every page: max width and vertical rhythm.
 */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl space-y-6", className)}>{children}</div>
  );
}
