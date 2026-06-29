import type { MenuItem } from "@/types";

export const FALLBACK_MENU_CATEGORY = "Punjabi Breakfast";

export function getMenuCategoriesFromInventory(inventory: MenuItem[]): string[] {
  const list = new Set<string>();
  for (const item of inventory) {
    if (item.category) list.add(item.category);
  }
  return Array.from(list);
}

export function getDefaultMenuCategory(inventory: MenuItem[]): string {
  return getMenuCategoriesFromInventory(inventory)[0] ?? FALLBACK_MENU_CATEGORY;
}
