import { api, type ApiResponse } from "../../../lib/api";
import type { AuthResult, AuthUser, LoginPayload, RegisterPayload } from "../types/auth.types";

/** Auth endpoints. Responses unwrap the backend `{ success, message, data }` envelope. */
export const authApi = {
  async register(payload: RegisterPayload): Promise<AuthResult> {
    const res = await api.post<ApiResponse<AuthResult>>("/auth/register", payload);
    return res.data as AuthResult;
  },
  async login(payload: LoginPayload): Promise<AuthResult> {
    const res = await api.post<ApiResponse<AuthResult>>("/auth/login", payload);
    return res.data as AuthResult;
  },
  async getMe(): Promise<AuthUser> {
    const res = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/me");
    return (res.data as { user: AuthUser }).user;
  },
};
