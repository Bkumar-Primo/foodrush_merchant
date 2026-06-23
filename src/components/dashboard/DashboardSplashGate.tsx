"use client";

import { type ReactNode, useEffect, useState } from "react";
import { FoodRushSplash } from "@/components/common/FoodRushSplash";

const SPLASH_SESSION_KEY = "foodrush-splash-seen";
const SPLASH_MIN_MS = 3600;
const SPLASH_EXIT_MS = 450;

type SplashPhase = "hidden" | "visible" | "exiting";

interface DashboardSplashGateProps {
  children: ReactNode;
}

function hasSeenSplashThisSession(): boolean {
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  } catch {
    return true;
  }
}

export function DashboardSplashGate({ children }: DashboardSplashGateProps): React.JSX.Element {
  const [hydrated, setHydrated] = useState(false);
  const [phase, setPhase] = useState<SplashPhase>("hidden");

  useEffect(() => {
    setHydrated(true);

    if (hasSeenSplashThisSession()) {
      return;
    }

    setPhase("visible");

    let exitTimer: number | undefined;

    const minTimer = window.setTimeout(() => {
      setPhase("exiting");

      exitTimer = window.setTimeout(() => {
        try {
          sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
        } catch {
          // ignore private browsing quota errors
        }
        setPhase("hidden");
      }, SPLASH_EXIT_MS);
    }, SPLASH_MIN_MS);

    return () => {
      window.clearTimeout(minTimer);
      if (exitTimer !== undefined) {
        window.clearTimeout(exitTimer);
      }
    };
  }, []);

  const showOverlay = hydrated && (phase === "visible" || phase === "exiting");

  return (
    <>
      {children}
      {showOverlay && <FoodRushSplash exiting={phase === "exiting"} />}
    </>
  );
}
