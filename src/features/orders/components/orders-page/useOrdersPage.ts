"use client";

import { useMemo, useState } from "react";
import { ORDER_PAGE_TABS } from "@/features/orders/constants";
import type { Order, OrderTab } from "@/types";

export type OrdersSortBy = "placed_at" | "order_id";

export function useOrdersPage(orders: Order[]) {
  const [activeTab, setActiveTab] = useState<OrderTab>("preparing");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<OrdersSortBy>("placed_at");

  const tabOrders = useMemo(() => {
    const preparing = orders.filter((o) => o.status === ORDER_PAGE_TABS[0].status);
    const ready = orders.filter((o) => o.status === ORDER_PAGE_TABS[1].status);
    const pickedUp = orders.filter((o) => o.status === ORDER_PAGE_TABS[2].status);
    return { preparing, ready, picked_up: pickedUp };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    let list = tabOrders[activeTab];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (o) => o.id.toLowerCase().includes(q) || o.id.slice(-4).toLowerCase().includes(q),
      );
    }
    if (sortBy === "placed_at") {
      list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    } else {
      list = [...list].sort((a, b) => a.id.localeCompare(b.id));
    }

    return list;
  }, [tabOrders, activeTab, searchQuery, sortBy]);

  return {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    tabOrders,
    filteredOrders,
  };
}
