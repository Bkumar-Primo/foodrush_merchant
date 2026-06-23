import type React from "react";
import type { MenuItem, TempAddonGroup } from "@/types";

export interface MenuEditorProps {
  inventory: MenuItem[];
  onToggleStock: (id: string, inStock: boolean, backInStockTime?: number) => void;
  onSaveItem: (item: MenuItem) => void | Promise<void>;
  onAddCategory: (categoryName: string) => void;
  onAddSubcategory: (categoryName: string, subcategoryName: string) => void;
  addonGroups: TempAddonGroup[];
  setAddonGroups: React.Dispatch<React.SetStateAction<TempAddonGroup[]>>;
}

export type SubTab = "editor" | "inventory" | "taxes" | "charges";

export type EditorView = "editor" | "addons";

export interface ToastMessage {
  title: string;
  desc: string;
}
