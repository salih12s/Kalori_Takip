/**
 * Centralized access to build-time environment values.
 * Keep all `import.meta.env` reads here so the rest of the app stays decoupled.
 */
const DEFAULT_API_URL = "http://localhost:5000/api";

export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? DEFAULT_API_URL,
} as const;
