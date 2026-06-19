"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ClipboardList } from "lucide-react";
import { Order } from "@/types";
import OrderDetailView from "./OrderDetailView";

type OrderTab = "preparing" | "ready" | "picked_up";

interface OrdersPageProps {
  orders: Order[];
  onReady: (id: string) => void;
  onDispatch: (id: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onReady,
  onDispatch,
}) => {
  const [activeTab, setActiveTab] = useState<OrderTab>("preparing");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"placed_at" | "order_id">("placed_at");

  // Map internal statuses to tabs
  const tabOrders = useMemo(() => {
    const preparing = orders.filter((o) => o.status === "preparing");
    const ready = orders.filter((o) => o.status === "ready_for_pickup");
    const pickedUp = orders.filter((o) => o.status === "dispatched");
    return { preparing, ready, picked_up: pickedUp };
  }, [orders]);

  // Current tab's orders with search filtering
  const filteredOrders = useMemo(() => {
    let list = tabOrders[activeTab];

    // Search by last 4 digits of order ID
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((o) => o.id.slice(-4).toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === "placed_at") {
      list = [...list].sort((a, b) => b.createdAt - a.createdAt);
    } else {
      list = [...list].sort((a, b) => a.id.localeCompare(b.id));
    }

    return list;
  }, [tabOrders, activeTab, searchQuery, sortBy]);

  const tabs: { key: OrderTab; label: string }[] = [
    { key: "preparing", label: "Preparing" },
    { key: "ready", label: "Ready" },
    { key: "picked_up", label: "Picked up" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* ===== TOP BAR: Tabs + Sort + Search ===== */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0">
        {/* Tab Pills */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => {
            const count = tabOrders[tab.key].length;
            const isActive = activeTab === tab.key;
            let activeBg = "bg-[#737DB8]";
            if (tab.key === "ready") activeBg = "bg-[#E76C37]";
            if (tab.key === "picked_up") activeBg = "bg-[#A25D43]";

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-sm border text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? `${activeBg} text-white border-transparent shadow-xs`
                    : "bg-white dark:bg-zinc-900 border-zinc-250 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                {tab.label}{count > 0 ? ` (${count})` : ""}
              </button>
            );
          })}
        </div>

        {/* Sort + Search */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "placed_at" | "order_id")}
              className="appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-3 pr-8 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
            >
              <option value="placed_at">Sort: Newest First</option>
              <option value="order_id">Sort: Order ID</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by the 4 digit order ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[220px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ===== ORDER LIST ===== */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50">
        {filteredOrders.length === 0 ? (
          activeTab === "preparing" ? (
            /* Chef cooking illustration empty state (Image 3) */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <svg viewBox="0 0 200 200" className="w-52 h-52 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Stove */}
                <rect x="70" y="110" width="60" height="50" rx="4" />
                <circle cx="85" cy="125" r="5" />
                <circle cx="115" cy="125" r="5" />
                <line x1="80" y1="145" x2="120" y2="145" />
                
                {/* Pot */}
                <rect x="80" y="95" width="40" height="15" rx="2" />
                <path d="M75 102h5M120 102h5" />
                <path d="M90 95c0-5 20-5 20 0" />

                {/* Steam */}
                <path d="M90 85c2-3-2-6 0-9M100 82c2-3-2-6 0-9M110 85c2-3-2-6 0-9" strokeWidth="1.5" />

                {/* Chef */}
                <path d="M128 45c-2-5-10-5-12 0-3-2-9-2-11 2-2-3-8-1-9 3 0 2 1 6 3 8h29c2-2 3-6 3-13z" />
                <rect x="101" y="58" width="27" height="8" rx="1" />
                <circle cx="114" cy="74" r="8" />
                <path d="M100 95v15c0 6 5 11 11 11h6c6 0 11-5 11-11V95" />
                <path d="M106 95h16v18c0 3-2 5-5 5h-6c-3 0-5-2-5-5V95z" strokeWidth="1.5" />

                {/* Spoon/Hand */}
                <path d="M100 98c-8 3-12 8-15 12" />
              </svg>
              <p className="text-sm font-black text-zinc-500 dark:text-zinc-400">
                Orders being prepared in your kitchen
              </p>
              <p className="mt-0.5 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                will appear here
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <ClipboardList className="h-12 w-12 text-zinc-300 dark:text-zinc-700 stroke-1" />
              <p className="mt-3 text-sm font-black text-zinc-550 dark:text-zinc-400">
                No orders in {tabs.find(t => t.key === activeTab)?.label}
              </p>
              <p className="mt-1 text-xs font-bold text-zinc-400 dark:text-zinc-500">
                Orders will appear here when their status changes
              </p>
            </div>
          )
        ) : (
          filteredOrders.map((order) => (
            <OrderDetailView
              key={order.id}
              order={order}
              activeTab={activeTab}
              onReady={onReady}
              onDispatch={onDispatch}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
