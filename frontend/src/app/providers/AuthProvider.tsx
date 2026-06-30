import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { authApi } from "../../features/auth/api/auth.api";
import type { AuthUser, LoginPayload, RegisterPayload } from "../../features/auth/types/auth.types";
import { authStorage } from "../../features/auth/utils/auth-storage";

export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
  refreshCurrentUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Holds the current session: user, token and derived auth flags.
 * On mount it validates an existing token by loading the current user.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => authStorage.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(() => Boolean(authStorage.getToken()));

  useEffect(() => {
    let active = true;

    async function loadMe() {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        if (active) setUser(me);
      } catch {
        authStorage.clearToken();
        if (active) {
          setUser(null);
          setToken(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void loadMe();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const result = await authApi.login(payload);
    authStorage.setToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const result = await authApi.register(payload);
    authStorage.setToken(result.token);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    authStorage.clearToken();
    setToken(null);
    setUser(null);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    if (!authStorage.getToken()) return;
    const me = await authApi.getMe();
    setUser(me);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refreshCurrentUser,
    }),
    [user, token, isLoading, login, register, logout, refreshCurrentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
