import bcrypt from "bcrypt";

import { AppError } from "../../shared/errors/app-error.js";
import { signAuthToken } from "../../shared/utils/jwt.js";
import { toAuthUser } from "./auth.mapper.js";
import { authRepository } from "./auth.repository.js";
import type { AuthResult, LoginInput, RegisterInput } from "./auth.types.js";

const passwordSaltRounds = 12;

function createAuthResult(user: Awaited<ReturnType<typeof authRepository.findById>>): AuthResult {
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const authUser = toAuthUser(user);
  const token = signAuthToken({
    userId: authUser.id,
    email: authUser.email,
    username: authUser.username,
    role: authUser.role
  });

  return {
    user: authUser,
    token
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingEmailUser = await authRepository.findByEmail(input.email);

    if (existingEmailUser) {
      throw new AppError("Email is already in use", 409);
    }

    const existingUsernameUser = await authRepository.findByUsername(input.username);

    if (existingUsernameUser) {
      throw new AppError("Username is already in use", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, passwordSaltRounds);
    const user = await authRepository.createUser({
      email: input.email,
      username: input.username,
      passwordHash
    });

    return createAuthResult(user);
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await authRepository.findByEmail(input.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    return createAuthResult(user);
  },

  async getCurrentUser(userId: string): Promise<AuthResult["user"]> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toAuthUser(user);
  }
};
