"use client";

import { type ReactNode, useEffect, useLayoutEffect, useState } from "react";
import {
  ensureSplashBootstrap,
  markSplashSeen,
  releaseSplashShell,
  SPLASH_DOM_IDS,
  SPLASH_TIMING,
  STORAGE_KEYS,
} from "@/lib/constants";

interface DashboardSplashGateProps {
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

function getSplashFallback(): HTMLElement | null {
  return document.getElementById(SPLASH_DOM_IDS.fallback);
}

export function DashboardSplashGate({ children }: DashboardSplashGateProps): React.ReactNode {
  // Keep SSR and first client render identical — never read sessionStorage here.
  const [phase, setPhase] = useState<SplashPhase>("splash");

  useLayoutEffect(() => {
    if (!hasSeenSplashThisSession()) return;
    releaseSplashShell();
    setPhase("ready");
  }, []);

  useEffect(() => {
    if (hasSeenSplashThisSession()) {
      releaseSplashShell();
      setPhase("ready");
      return;
    }

    ensureSplashBootstrap();

    let exitTimer: number | undefined;

    const minTimer = window.setTimeout(() => {
      markSplashSeen();
      getSplashFallback()?.classList.add("splash-overlay-exit");

      exitTimer = window.setTimeout(() => {
        releaseSplashShell();
        setPhase("ready");
      }, SPLASH_TIMING.exitMs);
    }, SPLASH_TIMING.minMs);

    return () => {
      window.clearTimeout(minTimer);
      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
      }
    };
  }, []);

  if (phase !== "ready") {
    return null;
  }

  return <>{children}</>;
}
