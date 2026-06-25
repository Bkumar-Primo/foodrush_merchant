"use client";

import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClockFading,
  ConciergeBell,
  SquareMenu,
  Star,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import { DASHBOARD_NAV_ITEMS, SIDEBAR_COPY } from "@/components/dashboard/constants";
import { tokens } from "@/lib/utils/tokens";
import type { DashboardTab, Order } from "@/types";

interface SidebarProps {
  orders: Order[];
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const NAV_ICONS: Record<DashboardTab, LucideIcon> = {
  orders: ConciergeBell,
  menu: SquareMenu,
  history: ClockFading,
  complaints: CircleAlert,
  reviews: Star,
};

export const Sidebar: React.FC<SidebarProps> = ({
  orders,
  activeTab,
  setActiveTab,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "rejected",
  ).length;

  const menuItems = useMemo(
    () =>
      DASHBOARD_NAV_ITEMS.map((item) => ({
        ...item,
        icon: NAV_ICONS[item.id],
      })),
    [],
  );

  return (
    <aside
      className={`relative flex flex-col border-r h-full bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800 transition-all duration-300 shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-[85%] -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-500"
        title={isCollapsed ? SIDEBAR_COPY.expandTitle : SIDEBAR_COPY.collapseTitle}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      <nav className="flex-1 space-y-0.5 py-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex w-full items-center py-3 px-6 text-xs font-medium transition-all cursor-pointer ${
                isCollapsed ? "justify-center px-0" : "justify-start"
              } ${
                isActive
                  ? "text-primary dark:text-[#F4A99A] border-r-[3px] border-primary bg-[#D4543C]/10 dark:bg-[#D4543C]/15"
                  : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-50"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary dark:text-[#F4A99A]" : "text-zinc-500 dark:text-zinc-400"}`}
              />

              {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}

              {item.hasCount &&
                activeOrdersCount > 0 &&
                (isCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500" />
                ) : (
                  <span className="ml-auto rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-medium text-white">
                    {activeOrdersCount}
                  </span>
                ))}

              {item.hasBadge && !isCollapsed && item.badgeLabel && (
                <span className="ml-auto rounded bg-primary px-1 py-0.5 text-[8px] font-medium text-primary-foreground leading-none">
                  {item.badgeLabel}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className={`border-t ${tokens.colors.borderMuted} p-3 pb-10`} />
    </aside>
  );
};

export default Sidebar;
