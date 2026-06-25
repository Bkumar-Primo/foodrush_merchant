import type { DashboardTab } from "@/types";

export interface DashboardNavItem {
  id: DashboardTab;
  label: string;
  hasCount?: boolean;
  hasBadge?: boolean;
  badgeLabel?: string;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { id: "orders", label: "Orders", hasCount: true },
  { id: "menu", label: "Menu", hasBadge: true, badgeLabel: "NEW" },
  { id: "history", label: "Order history" },
  { id: "complaints", label: "Customer complaints" },
  { id: "reviews", label: "Reviews" },
];

export const SIDEBAR_COPY = {
  expandTitle: "Expand Sidebar",
  collapseTitle: "Collapse Sidebar",
} as const;
