const CATEGORY_IMAGE_PATHS: Record<string, string> = {
  "punjabi breakfast": "/food/categories/punjabi-breakfast.png",
  "starters & snacks": "/food/categories/starters-snacks.png",
  "paneer specials": "/food/categories/paneer-specials.png",
  "dal & kadhi": "/food/categories/dal-kadhi.png",
  "veg curries": "/food/categories/veg-curries.png",
  "chicken curries": "/food/categories/chicken-curries.png",
  "mutton & lamb": "/food/categories/mutton-lamb.png",
  "tandoor specials": "/food/categories/tandoor-specials.png",
  "breads & paratha": "/food/categories/breads-paratha.png",
  "rice & pulao": "/food/categories/biryani.png",
  biryani: "/food/categories/biryani.png",
  "chole & rajma": "/food/categories/chole-rajma.png",
  "rolls & street food": "/food/categories/rolls-street-food.png",
  "lassi & beverages": "/food/categories/lassi-beverages.png",
  "punjabi sweets": "/food/categories/punjabi-sweets.png",
};

const DEFAULT_CATEGORY_IMAGE = "/food/categories/punjabi-breakfast.png";

function normalizeCategoryName(name: string): string {
  return name.trim().toLowerCase();
}

export function resolveFoodCategoryImagePath(categoryName: string): string {
  return CATEGORY_IMAGE_PATHS[normalizeCategoryName(categoryName)] ?? DEFAULT_CATEGORY_IMAGE;
}

/** Unique local category art paths used for defaults and DB sync. */
export function getCategoryImagePathMap(): Record<string, string> {
  return { ...CATEGORY_IMAGE_PATHS, default: DEFAULT_CATEGORY_IMAGE };
}
