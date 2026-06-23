"use client";

import { useMemo, useState } from "react";
import type { Order, OrderTab } from "@/types";

export type OrdersSortBy = "placed_at" | "order_id";

export function useOrdersPage(orders: Order[]) {
  const [activeTab, setActiveTab] = useState<OrderTab>("preparing");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<OrdersSortBy>("placed_at");

  const tabOrders = useMemo(() => {
    const preparing = orders.filter((o) => o.status === "preparing");
    const ready = orders.filter((o) => o.status === "ready_for_pickup");
    const pickedUp = orders.filter((o) => o.status === "dispatched");
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

export const ORDER_PAGE_TABS: { key: OrderTab; label: string }[] = [
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "picked_up", label: "Picked up" },
];
