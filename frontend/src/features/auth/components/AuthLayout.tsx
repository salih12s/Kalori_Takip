import { Flame } from "lucide-react";
import { Navigate, Outlet } from "react-router-dom";

import { routePaths } from "../../../app/router/routes";
import { FullScreenLoader } from "../../../components/shared/FullScreenLoader";
import { useOnboardingStatus } from "../../onboarding/hooks/useOnboarding";
import { useAuth } from "../hooks/useAuth";

/**
 * Centered shell for the login/register pages. Authenticated visitors are
 * redirected to the dashboard or onboarding depending on their goal status.
 */
export function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const onboardingStatus = useOnboardingStatus();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    if (onboardingStatus.isLoading) {
      return <FullScreenLoader />;
    }
    return (
      <Navigate
        to={onboardingStatus.data ? routePaths.dashboard : routePaths.onboarding}
        replace
      />
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-stone-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white">
            <Flame size={20} />
          </span>
          <span className="text-2xl font-bold tracking-tight text-stone-900">FitBoard</span>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <Outlet />
        </div>
        <p className="mt-6 text-center text-xs text-stone-400">FitBoard · Sağlıklı rekabet</p>
      </div>
    </div>
  );
}
