"use client";

import { ORDER_PAGE_TABS } from "@/features/orders/constants";
import type { Order } from "@/types";
import OrderDetailView from "../OrderDetailView";
import { OrdersPageTabs } from "./OrdersPageTabs";
import { OrdersPageToolbar } from "./OrdersPageToolbar";
import { OrdersPreparingEmptyIllustration } from "./OrdersPreparingEmptyIllustration";
import { OrdersTabEmptyState } from "./OrdersTabEmptyState";
import { useOrdersPage } from "./useOrdersPage";

interface OrdersPageProps {
  orders: Order[];
  onReady: (id: string) => void | Promise<void>;
  onDispatch: (id: string) => void | Promise<void>;
}

export function OrdersPage({ orders, onReady, onDispatch }: OrdersPageProps): React.JSX.Element {
  const page = useOrdersPage(orders);

  const tabCounts = {
    preparing: page.tabOrders.preparing.length,
    ready: page.tabOrders.ready.length,
    picked_up: page.tabOrders.picked_up.length,
  };

  const activeTabLabel = ORDER_PAGE_TABS.find((t) => t.key === page.activeTab)?.label ?? "";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 shrink-0">
        <OrdersPageTabs
          tabs={ORDER_PAGE_TABS}
          activeTab={page.activeTab}
          tabCounts={tabCounts}
          onTabChange={page.setActiveTab}
        />
        <OrdersPageToolbar
          sortBy={page.sortBy}
          searchQuery={page.searchQuery}
          onSortChange={page.setSortBy}
          onSearchChange={page.setSearchQuery}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50">
        {page.filteredOrders.length === 0 ? (
          page.activeTab === "preparing" ? (
            <OrdersPreparingEmptyIllustration />
          ) : (
            <OrdersTabEmptyState tabLabel={activeTabLabel} />
          )
        ) : (
          page.filteredOrders.map((order) => (
            <OrderDetailView
              key={order.id}
              order={order}
              activeTab={page.activeTab}
              onReady={onReady}
              onDispatch={onDispatch}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
