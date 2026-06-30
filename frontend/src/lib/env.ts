/**
 * Centralized access to build-time environment values.
 * Keep all `import.meta.env` reads here so the rest of the app stays decoupled.
 */
const DEFAULT_API_URL = "http://localhost:5000/api";
const DEFAULT_SOCKET_URL = "http://localhost:5000";

/** Returns a trimmed non-empty string, or undefined when the var is unset. */
function readEnvUrl(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

/**
 * API base URL. In development we fall back to localhost; in a production build
 * a missing value is almost certainly a misconfiguration, so we warn loudly
 * instead of silently shipping localhost to real users.
 */
function resolveApiUrl(): string {
  const configured = readEnvUrl(import.meta.env.VITE_API_URL);
  if (configured) return configured;

  if (import.meta.env.PROD) {
    console.warn(
      "[env] VITE_API_URL is not set in this production build. " +
        "Set it to the deployed backend /api URL; falling back to localhost for now."
    );
  }
  return DEFAULT_API_URL;
}

/**
 * Socket URL. If unset in production, derive it from the API URL (stripping a
 * trailing /api) so realtime connects to the backend, never the frontend domain.
 */
function resolveSocketUrl(apiUrl: string): string {
  const configured = readEnvUrl(import.meta.env.VITE_SOCKET_URL);
  if (configured) return configured;

  if (import.meta.env.PROD) {
    const derived = apiUrl.replace(/\/api\/?$/, "");
    console.warn(
      "[env] VITE_SOCKET_URL is not set in this production build. " +
        "Deriving it from VITE_API_URL."
    );
    return derived.length > 0 ? derived : DEFAULT_SOCKET_URL;
  }
  return DEFAULT_SOCKET_URL;
}

const apiUrl = resolveApiUrl();

export const env = {
  apiUrl,
  socketUrl: resolveSocketUrl(apiUrl),
} as const;
