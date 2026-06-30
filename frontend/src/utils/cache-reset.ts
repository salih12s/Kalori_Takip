import { APP_VERSION, APP_VERSION_STORAGE_KEY } from "../lib/app-version";

/**
 * Per-session flag used by the splash intro. Cleared on a version change so a
 * freshly deployed app can re-evaluate whether to show the intro.
 */
const introSessionKey = "saydamfitness_intro_seen";

/**
 * Startup cleanup that prevents an old deployment's cached assets from pinning
 * users on a stale (or broken) build — the classic "only works in incognito"
 * symptom.
 *
 * - Service workers are always unregistered: this app ships none, so any
 *   registration is a leftover that can serve a stale index.html.
 * - On a version change we additionally clear Cache Storage and the intro flag.
 *
 * The JWT auth token and the theme preference are intentionally preserved.
 * Safe to call on every startup; storage access is fully guarded.
 */
export function runCacheGuard(): void {
  // Always drop stale service workers (cheap no-op when there are none).
  void unregisterStaleServiceWorkers();

  let storedVersion: string | null = null;
  try {
    storedVersion = localStorage.getItem(APP_VERSION_STORAGE_KEY);
  } catch {
    // Storage blocked (private mode / quota). Nothing else we can safely do.
    return;
  }

  if (storedVersion === APP_VERSION) return;

  // New version detected: flush caches left by the previous deployment.
  void clearCacheStorage();

  try {
    sessionStorage.removeItem(introSessionKey);
  } catch {
    /* ignore */
  }

  try {
    localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_VERSION);
  } catch {
    /* ignore */
  }
}

async function unregisterStaleServiceWorkers(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  } catch {
    /* ignore */
  }
}

async function clearCacheStorage(): Promise<void> {
  if (!("caches" in window)) return;
  try {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  } catch {
    /* ignore */
  }
}
