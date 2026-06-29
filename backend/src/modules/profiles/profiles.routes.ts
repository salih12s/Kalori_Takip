import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getMyProfile, updateMyProfile } from "./profiles.controller.js";

export const profilesRoutes = Router();

profilesRoutes.get("/me", authMiddleware, getMyProfile);
profilesRoutes.put("/me", authMiddleware, updateMyProfile);
