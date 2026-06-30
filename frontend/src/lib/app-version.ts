/**
 * Single source of truth for the deployed app version.
 *
 * Prefer setting VITE_APP_VERSION at build time (e.g. a git SHA or release id).
 * The fallback is bumped in-commit so that even builds without the env var still
 * change their version string whenever the app meaningfully changes, which lets
 * the cache guard flush stale client caches after a deploy.
 */
const FALLBACK_APP_VERSION = "2026.06.30-mobile-cache-1";

function readVersion(): string {
  const configured = import.meta.env.VITE_APP_VERSION;
  if (typeof configured === "string" && configured.trim().length > 0) {
    return configured.trim();
  }
  return FALLBACK_APP_VERSION;
}

export const APP_VERSION = readVersion();

/** localStorage key holding the last app version this browser ran. */
export const APP_VERSION_STORAGE_KEY = "saydamfitness_app_version";
