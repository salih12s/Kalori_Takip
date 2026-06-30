import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { activityRoutes } from "./modules/activity/activity.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { challengesRoutes } from "./modules/challenges/challenges.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { gamificationRoutes } from "./modules/gamification/gamification.routes.js";
import { goalsRoutes } from "./modules/goals/goals.routes.js";
import { leaderboardRoutes } from "./modules/leaderboard/leaderboard.routes.js";
import { nutritionRoutes } from "./modules/nutrition/nutrition.routes.js";
import { profilesRoutes } from "./modules/profiles/profiles.routes.js";
import { socialRoutes } from "./modules/social/social.routes.js";
import { healthRoutes } from "./modules/system/health.routes.js";

export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profilesRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api", nutritionRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api", socialRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/challenges", challengesRoutes);
app.use("/api/gamification", gamificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
