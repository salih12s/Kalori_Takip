import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../../components/layout/AppLayout";
import { ActivityPage } from "../../features/activity/pages/ActivityPage";
import { AuthLayout } from "../../features/auth/components/AuthLayout";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { RegisterPage } from "../../features/auth/pages/RegisterPage";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { LeaderboardPage } from "../../features/leaderboard/pages/LeaderboardPage";
import { NutritionPage } from "../../features/nutrition/pages/NutritionPage";
import { OnboardingPage } from "../../features/onboarding/pages/OnboardingPage";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";
import { SettingsPage } from "../../features/settings/pages/SettingsPage";
import { FriendsPage } from "../../features/social/pages/FriendsPage";
import { routePaths } from "./routes";

/** Top-level routing for public auth pages and protected app pages. */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to={routePaths.dashboard} replace />} />

        <Route element={<AuthLayout />}>
          <Route path={routePaths.login} element={<LoginPage />} />
          <Route path={routePaths.register} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={routePaths.onboarding} element={<OnboardingPage />} />
        </Route>

        <Route element={<ProtectedRoute requireOnboardingComplete />}>
          <Route element={<AppLayout />}>
            <Route path={routePaths.dashboard} element={<DashboardPage />} />
            <Route path={routePaths.nutrition} element={<NutritionPage />} />
            <Route path={routePaths.activity} element={<ActivityPage />} />
            <Route path={routePaths.leaderboard} element={<LeaderboardPage />} />
            <Route path={routePaths.friends} element={<FriendsPage />} />
            <Route path={routePaths.profile} element={<ProfilePage />} />
            <Route path={routePaths.settings} element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={routePaths.dashboard} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
