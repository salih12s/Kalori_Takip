import { Toaster } from "sonner";

/**
 * Global toast outlet. Mounted once near the app root.
 * Feature code triggers toasts via `toast(...)` from sonner.
 */
export function AppToaster() {
  return <Toaster position="top-right" richColors closeButton />;
}
