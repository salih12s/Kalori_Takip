import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import {
  createChallenge,
  getChallenge,
  joinChallenge,
  leaveChallenge,
  listChallenges,
  listMyChallenges,
  recalculateAllChallenges,
  recalculateChallenge
} from "./challenges.controller.js";

export const challengesRoutes = Router();

// Static paths must be declared before the dynamic ":challengeId" route.
challengesRoutes.get("/", authMiddleware, listChallenges);
challengesRoutes.get("/mine", authMiddleware, listMyChallenges);
challengesRoutes.post("/recalculate-all", authMiddleware, recalculateAllChallenges);
challengesRoutes.post("/", authMiddleware, createChallenge);
challengesRoutes.get("/:challengeId", authMiddleware, getChallenge);
challengesRoutes.post("/:challengeId/join", authMiddleware, joinChallenge);
challengesRoutes.delete("/:challengeId/leave", authMiddleware, leaveChallenge);
challengesRoutes.post("/:challengeId/recalculate", authMiddleware, recalculateChallenge);
