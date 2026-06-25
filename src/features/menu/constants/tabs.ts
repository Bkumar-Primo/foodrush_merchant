import type { SubTab } from "@/features/menu/components/menu-editor/types";

export const MENU_EDITOR_TABS: { id: SubTab; label: string }[] = [
  { id: "editor", label: "Menu editor" },
  { id: "inventory", label: "Manage inventory" },
  { id: "taxes", label: "Taxes" },
  { id: "charges", label: "Charges" },
];

export const MENU_INVENTORY_TABS = {
  dishes: "Dishes",
  addons: "Add Ons",
} as const;
