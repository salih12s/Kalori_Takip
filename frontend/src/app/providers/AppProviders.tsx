import type { ReactNode } from "react";

import { AppToaster } from "../../components/feedback/AppToaster";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composes all global providers in one place.
 * Add future providers (auth, theme, i18n) here to keep App.tsx flat.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <AppToaster />
      </AuthProvider>
    </QueryProvider>
  );
}
