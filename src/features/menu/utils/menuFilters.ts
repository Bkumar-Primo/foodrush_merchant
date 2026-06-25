import { isMenuItem, isTempAddonGroup } from "@/lib/db";
import type { MenuItem, TempAddonGroup } from "@/types";

export type FoodTypeFilter = "all" | "veg" | "non-veg" | "egg";
export type StockFilter = "all" | "in_stock" | "out_of_stock";
export type PriceFilter = "all" | "under_100" | "100_200" | "over_200";

export interface MenuFilters {
  foodType: FoodTypeFilter;
  stockStatus: StockFilter;
  priceRange: PriceFilter;
  customisableOnly: boolean;
}

export const DEFAULT_MENU_FILTERS: MenuFilters = {
  foodType: "all",
  stockStatus: "all",
  priceRange: "all",
  customisableOnly: false,
};

export function hasActiveFilters(filters: MenuFilters) {
  return (
    filters.foodType !== "all" ||
    filters.stockStatus !== "all" ||
    filters.priceRange !== "all" ||
    filters.customisableOnly
  );
}

export function matchesMenuSearch(item: MenuItem, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    item.name.toLowerCase().includes(q) ||
    (item.description?.toLowerCase().includes(q) ?? false) ||
    item.category.toLowerCase().includes(q) ||
    (item.subcategory?.toLowerCase().includes(q) ?? false)
  );
}

export function matchesPriceRange(price: number, range: PriceFilter) {
  if (range === "all") return true;
  if (range === "under_100") return price < 100;
  if (range === "100_200") return price >= 100 && price <= 200;
  return price > 200;
}

export function matchesMenuFilters(item: MenuItem, filters: MenuFilters) {
  if (filters.foodType !== "all" && item.foodType !== filters.foodType) {
    return false;
  }
  if (filters.stockStatus === "in_stock" && !item.inStock) return false;
  if (filters.stockStatus === "out_of_stock" && item.inStock) return false;
  if (!matchesPriceRange(item.price, filters.priceRange)) return false;
  if (filters.customisableOnly && !item.customisable) return false;
  return true;
}

export function filterMenuItems(items: MenuItem[], query: string, filters: MenuFilters) {
  return items.filter(
    (item) => matchesMenuSearch(item, query) && matchesMenuFilters(item, filters),
  );
}

export function matchesAddonSearch(group: TempAddonGroup, query: string) {
  if (!query.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    group.name.toLowerCase().includes(q) ||
    group.options.some((o) => o.name.toLowerCase().includes(q))
  );
}

export function exportMenuData(inventory: MenuItem[], addonGroups: TempAddonGroup[]) {
  const payload = {
    exportedAt: new Date().toISOString(),
    inventory,
    addonGroups,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `menu-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export interface MenuImportPayload {
  inventory?: MenuItem[];
  addonGroups?: TempAddonGroup[];
}

export function parseMenuImportFile(file: File): Promise<MenuImportPayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(reader.result as string);
        if (Array.isArray(parsed)) {
          resolve({ inventory: parsed.filter(isMenuItem) });
          return;
        }
        if (typeof parsed === "object" && parsed !== null) {
          const record = parsed as Record<string, unknown>;
          resolve({
            inventory: Array.isArray(record.inventory)
              ? record.inventory.filter(isMenuItem)
              : undefined,
            addonGroups: Array.isArray(record.addonGroups)
              ? record.addonGroups.filter(isTempAddonGroup)
              : undefined,
          });
          return;
        }
        reject(new Error("Invalid menu file"));
      } catch {
        reject(new Error("Invalid menu file"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
