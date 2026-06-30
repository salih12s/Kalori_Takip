import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  getFriendsLeaderboard,
  getMonthlyLeaderboard,
  getMyLeaderboardSummary,
  getWeeklyLeaderboard,
  recalculateLeaderboard,
  recalculateLeaderboardRange
} from "./leaderboard.controller.js";

export const leaderboardRoutes = Router();

leaderboardRoutes.post("/recalculate", authMiddleware, recalculateLeaderboard);
leaderboardRoutes.post("/recalculate-range", authMiddleware, recalculateLeaderboardRange);
leaderboardRoutes.get("/weekly", authMiddleware, getWeeklyLeaderboard);
leaderboardRoutes.get("/monthly", authMiddleware, getMonthlyLeaderboard);
leaderboardRoutes.get("/friends", authMiddleware, getFriendsLeaderboard);
leaderboardRoutes.get("/me/summary", authMiddleware, getMyLeaderboardSummary);
