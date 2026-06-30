import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../../components/layout/AppLayout";
import { ActivityPage } from "../../features/activity/pages/ActivityPage";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { LeaderboardPage } from "../../features/leaderboard/pages/LeaderboardPage";
import { NutritionPage } from "../../features/nutrition/pages/NutritionPage";
import { ProfilePage } from "../../features/profile/pages/ProfilePage";
import { SettingsPage } from "../../features/settings/pages/SettingsPage";
import { FriendsPage } from "../../features/social/pages/FriendsPage";
import { routePaths } from "./routes";

/**
 * Top-level routing. Every page renders inside the shared AppLayout shell.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={routePaths.dashboard} replace />} />
          <Route path={routePaths.dashboard} element={<DashboardPage />} />
          <Route path={routePaths.nutrition} element={<NutritionPage />} />
          <Route path={routePaths.activity} element={<ActivityPage />} />
          <Route path={routePaths.leaderboard} element={<LeaderboardPage />} />
          <Route path={routePaths.friends} element={<FriendsPage />} />
          <Route path={routePaths.profile} element={<ProfilePage />} />
          <Route path={routePaths.settings} element={<SettingsPage />} />
          <Route path="*" element={<Navigate to={routePaths.dashboard} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
