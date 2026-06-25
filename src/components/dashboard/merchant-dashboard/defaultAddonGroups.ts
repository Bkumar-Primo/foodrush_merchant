import type { TempAddonGroup } from "@/types";

export const DEFAULT_ADDON_GROUPS: TempAddonGroup[] = [
  {
    id: "grp_addon",
    name: "Add On",
    options: [{ id: "add_ghee", name: "Ghee", price: 8 }],
  },
  {
    id: "grp_bev",
    name: "Choose Your Beverage",
    options: [
      { id: "add_tu", name: "Thums Up Soft Beverage [250 ml]", price: 20 },
      { id: "add_zc", name: "Zero Sugar Coke Soft Beverage [250 ml]", price: 20 },
      { id: "add_coke", name: "Coke [250 ml]", price: 20 },
    ],
  },
  {
    id: "grp_extra",
    name: "Extra",
    options: [{ id: "add_paratha", name: "Paratha", price: 15 }],
  },
];
