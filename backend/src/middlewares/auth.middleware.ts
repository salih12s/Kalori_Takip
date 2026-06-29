import type { RequestHandler } from "express";

import { AppError } from "../shared/errors/app-error.js";
import { verifyAuthToken } from "../shared/utils/jwt.js";

export const authMiddleware: RequestHandler = (req, _res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(new AppError("Authorization token is required", 401));
  }

  const token = authorizationHeader.slice("Bearer ".length).trim();

  if (!token) {
    return next(new AppError("Authorization token is required", 401));
  }

  try {
    const payload = verifyAuthToken(token);

    req.user = {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
      role: payload.role
    };

    return next();
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }
};
