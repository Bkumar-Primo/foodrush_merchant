"use client";

import { type ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { FoodRushSplash } from "@/components/common/FoodRushSplash";
import { markSplashSeen, SPLASH_TIMING, STORAGE_KEYS } from "@/lib/constants";

interface AppSplashGateProps {
  children: ReactNode;
}

type SplashPhase = "splash" | "ready";

function hasSeenSplashThisSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.splashSeen) === "1";
  } catch {
    return true;
  }
}

/** Full-screen splash on first visit per session; blocks route paint until complete. */
export function AppSplashGate({ children }: AppSplashGateProps): React.ReactNode {
  const [phase, setPhase] = useState<SplashPhase>("splash");
  const [isExiting, setIsExiting] = useState(false);

  useLayoutEffect(() => {
    if (!hasSeenSplashThisSession()) return;
    setPhase("ready");
  }, []);

  useEffect(() => {
    if (hasSeenSplashThisSession()) {
      setPhase("ready");
      return;
    }

    let exitTimer: number | undefined;

    const minTimer = window.setTimeout(() => {
      markSplashSeen();
      setIsExiting(true);

      exitTimer = window.setTimeout(() => {
        setPhase("ready");
        setIsExiting(false);
      }, SPLASH_TIMING.exitMs);
    }, SPLASH_TIMING.minMs);

    return () => {
      window.clearTimeout(minTimer);
      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
      }
    };
  }, []);

  return (
    <>
      {phase === "ready" ? children : null}
      {phase !== "ready" ? <FoodRushSplash exiting={isExiting} /> : null}
    </>
  );
}
