import { Router } from "express";

import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getMe, login, register } from "./auth.controller.js";

export const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.get("/me", authMiddleware, getMe);
