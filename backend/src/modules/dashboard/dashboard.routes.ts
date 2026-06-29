import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getTodayDashboard, getWeeklyDashboard } from "./dashboard.controller.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/today", authMiddleware, getTodayDashboard);
dashboardRoutes.get("/weekly", authMiddleware, getWeeklyDashboard);
