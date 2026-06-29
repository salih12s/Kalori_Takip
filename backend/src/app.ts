import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";
import { notFoundHandler } from "./middlewares/not-found.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { goalsRoutes } from "./modules/goals/goals.routes.js";
import { nutritionRoutes } from "./modules/nutrition/nutrition.routes.js";
import { profilesRoutes } from "./modules/profiles/profiles.routes.js";
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

app.use(notFoundHandler);
app.use(errorHandler);
