import type { UserRole } from "@prisma/client";
import type { z } from "zod";

import type { loginSchema, registerSchema } from "./auth.validation.js";

export type RegisterInput = z.infer<typeof registerSchema>;

export type LoginInput = z.infer<typeof loginSchema>;

export type AuthUser = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResult = {
  user: AuthUser;
  token: string;
};
