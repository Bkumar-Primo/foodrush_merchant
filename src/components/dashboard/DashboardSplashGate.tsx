"use client";

import { type ReactNode, useEffect, useState } from "react";
import { SPLASH_DOM_IDS, SPLASH_TIMING, STORAGE_KEYS } from "@/lib/constants";

interface DashboardSplashGateProps {
  children: ReactNode;
}

function hasSeenSplashThisSession(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.splashSeen) === "1";
  } catch {
    return true;
  }
}

function isSplashBlocking(): boolean {
  return document.getElementById(SPLASH_DOM_IDS.blockStyle) !== null;
}

function clearSplashBlock(): void {
  document.getElementById(SPLASH_DOM_IDS.blockStyle)?.remove();
}

function getSplashFallback(): HTMLElement | null {
  return document.getElementById(SPLASH_DOM_IDS.fallback);
}

export function DashboardSplashGate({ children }: DashboardSplashGateProps): React.ReactNode {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fallback = getSplashFallback();

    if (hasSeenSplashThisSession() || !isSplashBlocking()) {
      clearSplashBlock();
      fallback?.remove();
      setShowContent(true);
      return;
    }

    let exitTimer: number | undefined;

    const minTimer = window.setTimeout(() => {
      fallback?.classList.add("splash-overlay-exit");

      exitTimer = window.setTimeout(() => {
        try {
          sessionStorage.setItem(STORAGE_KEYS.splashSeen, "1");
        } catch {
          // ignore private browsing quota errors
        }
        clearSplashBlock();
        fallback?.remove();
        setShowContent(true);
      }, SPLASH_TIMING.exitMs);
    }, SPLASH_TIMING.minMs);

    return () => {
      window.clearTimeout(minTimer);
      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
      }
    };
  }, []);

  if (!showContent) {
    return null;
  }

  return <>{children}</>;
}
