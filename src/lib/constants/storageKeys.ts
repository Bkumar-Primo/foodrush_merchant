/** localStorage / sessionStorage keys and splash DOM ids (keep in sync with globals.css). */
export const STORAGE_KEYS = {
  splashSeen: "foodrush-splash-seen",
  merchantTheme: "foodrush-merchant-theme",
} as const;

export const SPLASH_DOM_IDS = {
  fallback: "foodrush-splash-fallback",
  blockStyle: "foodrush-splash-block",
} as const;

export const DATA_ATTRIBUTES = {
  dashboardShell: "data-dashboard-shell",
} as const;
