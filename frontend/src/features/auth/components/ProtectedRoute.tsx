import { Navigate, Outlet } from "react-router-dom";

import { routePaths } from "../../../app/router/routes";
import { FullScreenLoader } from "../../../components/shared/FullScreenLoader";
import { useOnboardingStatus } from "../../onboarding/hooks/useOnboarding";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  requireOnboardingComplete?: boolean;
}

/**
 * Gate for authenticated areas. It can also require an active goal before
 * allowing the main app shell.
 */
export function ProtectedRoute({ requireOnboardingComplete = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const onboardingStatus = useOnboardingStatus();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to={routePaths.login} replace />;
  }

  if (requireOnboardingComplete) {
    if (onboardingStatus.isLoading) {
      return <FullScreenLoader />;
    }
    if (!onboardingStatus.data) {
      return <Navigate to={routePaths.onboarding} replace />;
    }
  }

  return <Outlet />;
}
