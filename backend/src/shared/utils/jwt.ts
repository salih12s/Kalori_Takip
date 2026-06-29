import jwt from "jsonwebtoken";

import type { UserRole } from "@prisma/client";

import { env } from "../../config/env.js";

export type AuthTokenPayload = {
  userId: string;
  email: string;
  username: string;
  role: UserRole;
};

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: "7d"
  });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload;
}
