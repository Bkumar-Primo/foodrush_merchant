"use client";

import type { OrderTab } from "@/types";

interface OrdersPageTabsProps {
  tabs: { key: OrderTab; label: string }[];
  activeTab: OrderTab;
  tabCounts: Record<OrderTab, number>;
  onTabChange: (tab: OrderTab) => void;
}

const TAB_ACTIVE_BG: Record<OrderTab, string> = {
  preparing: "bg-[#737DB8]",
  ready: "bg-[#E76C37]",
  picked_up: "bg-[#A25D43]",
};

export function OrdersPageTabs({
  tabs,
  activeTab,
  tabCounts,
  onTabChange,
}: OrdersPageTabsProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => {
        const count = tabCounts[tab.key];
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-4 py-1.5 rounded-sm border text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? `${TAB_ACTIVE_BG[tab.key]} text-white border-transparent shadow-xs`
                : "bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            }`}
          >
            {tab.label}
            {count > 0 ? ` (${count})` : ""}
          </button>
        );
      })}
    </div>
  );
}
