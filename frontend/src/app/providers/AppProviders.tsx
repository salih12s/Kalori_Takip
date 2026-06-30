import type { ReactNode } from "react";

import { AppToaster } from "../../components/feedback/AppToaster";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { RealtimeProvider } from "./RealtimeProvider";
import { ThemeProvider } from "./ThemeProvider";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Composes all global providers in one place.
 * Add future providers (auth, theme, i18n) here to keep App.tsx flat.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <RealtimeProvider>{children}</RealtimeProvider>
          <AppToaster />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
