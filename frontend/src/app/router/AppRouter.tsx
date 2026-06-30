import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../../components/layout/AppLayout";
import { AuthLayout } from "../../features/auth/components/AuthLayout";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute";
import { routePaths } from "./routes";

const ActivityPage = lazy(() => import("../../features/activity/pages/ActivityPage").then((module) => ({ default: module.ActivityPage })));
const BadgesPage = lazy(() => import("../../features/gamification/pages/BadgesPage").then((module) => ({ default: module.BadgesPage })));
const ChallengesPage = lazy(() => import("../../features/challenges/pages/ChallengesPage").then((module) => ({ default: module.ChallengesPage })));
const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage").then((module) => ({ default: module.DashboardPage })));
const FriendsPage = lazy(() => import("../../features/social/pages/FriendsPage").then((module) => ({ default: module.FriendsPage })));
const LeaderboardPage = lazy(() => import("../../features/leaderboard/pages/LeaderboardPage").then((module) => ({ default: module.LeaderboardPage })));
const LoginPage = lazy(() => import("../../features/auth/pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const NutritionPage = lazy(() => import("../../features/nutrition/pages/NutritionPage").then((module) => ({ default: module.NutritionPage })));
const OnboardingPage = lazy(() => import("../../features/onboarding/pages/OnboardingPage").then((module) => ({ default: module.OnboardingPage })));
const ProfilePage = lazy(() => import("../../features/profile/pages/ProfilePage").then((module) => ({ default: module.ProfilePage })));
const RegisterPage = lazy(() => import("../../features/auth/pages/RegisterPage").then((module) => ({ default: module.RegisterPage })));
const SettingsPage = lazy(() => import("../../features/settings/pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center bg-stone-50 px-4 text-sm font-medium text-stone-500">
      Yükleniyor...
    </div>
  );
}

/** Top-level routing for public auth pages and protected app pages. */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
              <Route path={routePaths.challenges} element={<ChallengesPage />} />
              <Route path={routePaths.badges} element={<BadgesPage />} />
              <Route path={routePaths.friends} element={<FriendsPage />} />
              <Route path={routePaths.profile} element={<ProfilePage />} />
              <Route path={routePaths.settings} element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={routePaths.dashboard} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
