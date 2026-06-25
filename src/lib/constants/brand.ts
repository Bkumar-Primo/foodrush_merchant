/** Bump when replacing files under public/brand/ — pair with a dev-server restart + hard refresh. */
export const BRAND_ASSET_VERSION = "2";

export const BRAND = {
  name: "FoodRush",
  nameFood: "Food",
  nameRush: "Rush",
  merchantConsoleTagline: "— merchant console —",
  merchantDashboardTagline: "• Merchant Dashboard •",
  loadingLabel: "Loading...",
} as const;

export const BRAND_ASSETS = {
  scooterImage: "/brand/foodrush-scooter.png",
  splashImage: "/brand/foodrush-splash.png",
  loginHero: "/brand/right.png",
  logo: "/brand/logo1.png",
} as const;

/** Intrinsic file dimensions (public/brand/right.png). */
export const BRAND_LOGIN_HERO_SIZE = { width: 1047, height: 999 } as const;

/** Fixed on-screen size for the login hero (keeps aspect ratio of right.png). */
export const BRAND_LOGIN_HERO_DISPLAY = { width: 713, height: 680 } as const;
