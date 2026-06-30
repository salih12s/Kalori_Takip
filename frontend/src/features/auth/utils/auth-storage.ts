/** Single localStorage key for the MVP auth token. */
export const TOKEN_STORAGE_KEY = "fitboard_token";

/**
 * Token persistence helpers. Wrapped in try/catch so private-mode or
 * storage-disabled browsers degrade gracefully instead of throwing.
 */
export const authStorage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string): void {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch {
      /* ignore storage errors */
    }
  },
  clearToken(): void {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      /* ignore storage errors */
    }
  },
};
