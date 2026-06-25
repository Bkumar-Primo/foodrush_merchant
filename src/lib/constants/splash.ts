import { SPLASH_DOM_IDS, STORAGE_KEYS } from "./storageKeys";
import { TIMING } from "./timing";

export const SPLASH_TIMING = {
  minMs: TIMING.splashMinMs,
  exitMs: TIMING.splashExitMs,
} as const;

/** Inline script for beforeInteractive — must stay in sync with SPLASH_DOM_IDS. */
export function createSplashBootstrapScript(): string {
  const { splashSeen } = STORAGE_KEYS;
  const { fallback, blockStyle } = SPLASH_DOM_IDS;

  return `(function(){try{if(sessionStorage.getItem("${splashSeen}")==="1")return;var style=document.createElement("style");style.id="${blockStyle}";style.textContent="#${fallback}{display:flex!important;position:fixed;inset:0;z-index:100}[data-dashboard-shell]{display:none!important}";document.head.appendChild(style)}catch(e){}})();`;
}
