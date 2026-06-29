import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createGoal, getMyGoal, updateGoal } from "./goals.controller.js";

export const goalsRoutes = Router();

goalsRoutes.get("/me", authMiddleware, getMyGoal);
goalsRoutes.post("/", authMiddleware, createGoal);
goalsRoutes.put("/:goalId", authMiddleware, updateGoal);
