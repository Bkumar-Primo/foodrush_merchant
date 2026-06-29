/** Bump when replacing files under public/brand/ (same filename → CDN/browser cache). */
export const BRAND_ASSET_VERSION = "3";

function brandAsset(path: string): string {
  return `${path}?v=${BRAND_ASSET_VERSION}`;
}

export const BRAND = {
  name: "FoodRush",
  nameFood: "Food",
  nameRush: "Rush",
  merchantConsoleTagline: "— merchant console —",
  merchantDashboardTagline: "• Merchant Dashboard •",
  loadingLabel: "Loading...",
} as const;

export const BRAND_ASSETS = {
  scooterImage: brandAsset("/brand/foodrush-scooter.png"),
  splashImage: brandAsset("/brand/foodrush-splash.png"),
  loginHero: brandAsset("/brand/right.png"),
  logo: brandAsset("/brand/logo1.png"),
} as const;

/** Intrinsic file dimensions (public/brand/right.png). */
export const BRAND_LOGIN_HERO_SIZE = { width: 1047, height: 999 } as const;

/** Fixed on-screen size for the login hero (keeps aspect ratio of right.png). */
export const BRAND_LOGIN_HERO_DISPLAY = { width: 713, height: 680 } as const;
