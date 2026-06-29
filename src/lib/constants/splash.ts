import { DATA_ATTRIBUTES, SPLASH_DOM_IDS, STORAGE_KEYS } from "./storageKeys";
import { TIMING } from "./timing";

export const SPLASH_TIMING = {
  minMs: TIMING.splashMinMs,
  exitMs: TIMING.splashExitMs,
} as const;

const SPLASH_BLOCK_CSS = `#${SPLASH_DOM_IDS.fallback}{display:flex!important;position:fixed;inset:0;z-index:100}[${DATA_ATTRIBUTES.dashboardShell}]{display:none!important}`;

/** Inline bootstrap script — must stay in sync with SPLASH_BLOCK_CSS. */
export function createSplashBootstrapScript(): string {
  const { splashSeen } = STORAGE_KEYS;
  const { blockStyle } = SPLASH_DOM_IDS;

  return `(function(){try{if(sessionStorage.getItem("${splashSeen}")==="1")return;var style=document.createElement("style");style.id="${blockStyle}";style.textContent=${JSON.stringify(SPLASH_BLOCK_CSS)};document.head.appendChild(style)}catch(e){}})();`;
}

/** Client fallback when the SSR bootstrap script did not run. */
export function ensureSplashBootstrap(): void {
  try {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEYS.splashSeen) === "1") return;
    if (document.getElementById(SPLASH_DOM_IDS.blockStyle)) return;

    const style = document.createElement("style");
    style.id = SPLASH_DOM_IDS.blockStyle;
    style.textContent = SPLASH_BLOCK_CSS;
    document.head.appendChild(style);
  } catch {
    // ignore private browsing / quota errors
  }
}

export function markSplashSeen(): void {
  try {
    sessionStorage.setItem(STORAGE_KEYS.splashSeen, "1");
  } catch {
    // ignore private browsing / quota errors
  }
}

export function releaseSplashShell(): void {
  try {
    document.getElementById(SPLASH_DOM_IDS.blockStyle)?.remove();
    document.getElementById(SPLASH_DOM_IDS.fallback)?.remove();

    const shell = document.querySelector(`[${DATA_ATTRIBUTES.dashboardShell}]`);
    if (shell instanceof HTMLElement) {
      shell.style.removeProperty("display");
    }
  } catch {
    // ignore DOM errors during teardown
  }
}
