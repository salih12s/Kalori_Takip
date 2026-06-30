import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getBadges, getMyBadges, getSummary, recalculate } from "./gamification.controller.js";

export const gamificationRoutes = Router();

gamificationRoutes.get("/badges", authMiddleware, getBadges);
gamificationRoutes.get("/me/summary", authMiddleware, getSummary);
gamificationRoutes.get("/me/badges", authMiddleware, getMyBadges);
gamificationRoutes.post("/recalculate", authMiddleware, recalculate);
