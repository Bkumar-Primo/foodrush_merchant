import type React from "react";
import type { MenuItem, TempAddonGroup } from "@/types";

export interface EditItemModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  categories: string[];
  categorySubcategories?: Record<string, string[]>;
  onClose: () => void;
  onSave: (updatedItem: MenuItem) => void;
  addonGroups: TempAddonGroup[];
  setAddonGroups: React.Dispatch<React.SetStateAction<TempAddonGroup[]>>;
}

export interface VariantPropertyItem {
  id: string;
  name: string;
  options: string[];
}

export interface CustomCharge {
  id: string;
  name: string;
  amount: number;
}

export type FoodType = MenuItem["foodType"];
export type PhotoTab = "guidelines" | "upload";
export type VariantTemplate = "Size" | "Quantity" | "PrepType" | "Base";
export type VariantStep = 1 | 2;
