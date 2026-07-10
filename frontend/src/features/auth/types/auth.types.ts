export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  email: string | null;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
}
