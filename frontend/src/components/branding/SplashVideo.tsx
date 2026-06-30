import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const sessionKey = "saydamfitness_intro_seen";
const desktopVideo = "/branding/saydamfitness-intro.mp4";
const mobileVideo = "/branding/saydamfitness-intro-mobile.mp4";

function getIntroVideoSource() {
  return window.matchMedia("(max-width: 768px)").matches ? mobileVideo : desktopVideo;
}

export function SplashVideo() {
  const [visible, setVisible] = useState(() => sessionStorage.getItem(sessionKey) !== "true");
  const [canSkip, setCanSkip] = useState(false);
  const [videoSource] = useState(getIntroVideoSource);

  useEffect(() => {
    if (!visible) return;

    const skipTimer = window.setTimeout(() => setCanSkip(true), 1200);
    const maxTimer = window.setTimeout(() => closeSplash(), 5000);

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(maxTimer);
    };
  }, [visible]);

  const closeSplash = () => {
    sessionStorage.setItem(sessionKey, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-stone-950"
        >
          <video
            src={videoSource}
            className="h-full w-full object-cover"
            autoPlay
            muted
            playsInline
            onEnded={closeSplash}
            onError={closeSplash}
          />
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
