import { STORAGE_KEYS } from "./storageKeys";
import { TIMING } from "./timing";

export const SPLASH_TIMING = {
  minMs: TIMING.splashMinMs,
  exitMs: TIMING.splashExitMs,
} as const;

export function markSplashSeen(): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.splashSeen, "1");
  } catch {
    // ignore private browsing / quota errors
  }
}
