import type { MenuItem, TempAddonGroup } from "@/types";
import type { MenuFilters } from "../../utils/menuFilters";

export interface MenuInventoryProps {
  inventory: MenuItem[];
  onToggleStock: (id: string, inStock: boolean, backInStockTime?: number) => void;
  addonGroups: TempAddonGroup[];
  setAddonGroups: React.Dispatch<React.SetStateAction<TempAddonGroup[]>>;
  searchQuery?: string;
  filters?: MenuFilters;
  hideToolbar?: boolean;
}

export type RestockTargetType = "dish" | "category" | "addon-group" | "addon-option";

export interface RestockModalTarget {
  type: RestockTargetType;
  id: string;
  name: string;
}

export type RestockDuration = "2h" | "4h" | "next-day" | "custom";

export interface DayOption {
  dateStr: string;
  dayName: string;
  dayNum: number;
  monthName: string;
}

export type InventoryTab = "dishes" | "addons";
