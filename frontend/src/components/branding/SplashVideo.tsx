import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const sessionKey = "saydamfitness_intro_seen";
const desktopVideo = "/branding/saydamfitness-intro.mp4";
const mobileVideo = "/branding/saydamfitness-intro-mobile-v2.mp4";
const posterImage = "/branding/saydamfitness-logo.png";

// Fail-safes so the splash can never trap the user on a black screen.
const SKIP_VISIBLE_MS = 800; // when the "Geç" button appears
const START_TIMEOUT_MS = 2000; // if playback has not begun, continue to auth
const MAX_DURATION_MS = 4000; // hard cap on total splash time

/** Picks the lighter mobile cut on small screens, full cut on desktop. */
function getIntroVideoSource(): string {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return desktopVideo;
  }
  return window.matchMedia("(max-width: 768px)").matches ? mobileVideo : desktopVideo;
}

/**
 * One-shot intro splash shown on the auth pages only. It is best-effort: if
 * autoplay is blocked, the video is slow, or it errors, we fall through to the
 * login/register form instead of blocking. Never waits forever.
 */
export function SplashVideo() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(sessionKey) !== "true";
    } catch {
      return true;
    }
  });
  const [started, setStarted] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [videoSource] = useState(getIntroVideoSource);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const startedRef = useRef(false);

  const closeSplash = useCallback(() => {
    try {
      sessionStorage.setItem(sessionKey, "true");
    } catch {
      /* ignore storage errors */
    }
    setVisible(false);
  }, []);

  const handleStarted = useCallback(() => {
    startedRef.current = true;
    setStarted(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const skipTimer = window.setTimeout(() => setCanSkip(true), SKIP_VISIBLE_MS);

    // If playback never begins (autoplay blocked, slow network, codec issue),
    // do not leave the user staring at a black frame — move on to the form.
    const startTimer = window.setTimeout(() => {
      if (!startedRef.current) closeSplash();
    }, START_TIMEOUT_MS);

    // Hard cap regardless of what the video does.
    const maxTimer = window.setTimeout(closeSplash, MAX_DURATION_MS);

    // Best-effort autoplay attempt; muted + playsInline permits it on mobile.
    const video = videoRef.current;
    const playResult = video?.play();
    if (playResult && typeof playResult.catch === "function") {
      playResult.catch(() => {
        // Autoplay rejected: continue to auth rather than hanging.
        closeSplash();
      });
    }

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(startTimer);
      window.clearTimeout(maxTimer);
    };
  }, [visible, closeSplash]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 grid place-items-center bg-stone-950"
        >
          <video
            key={videoSource}
            ref={videoRef}
            src={videoSource}
            poster={posterImage}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            onPlaying={handleStarted}
            onLoadedData={handleStarted}
            onEnded={closeSplash}
            onError={closeSplash}
          />

          {!started ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="rounded-full bg-black/40 px-4 py-1.5 text-sm font-medium text-stone-100">
                Hazırlanıyor...
              </span>
            </div>
          ) : null}

          {canSkip ? (
            <button
              type="button"
              onClick={closeSplash}
              className="absolute bottom-6 right-6 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-stone-900 shadow-sm hover:bg-white"
            >
              Geç
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
