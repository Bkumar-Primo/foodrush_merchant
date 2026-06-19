import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClockFading,
  ConciergeBell,
  PlusCircle,
  SquareMenu,
  Star,
} from "lucide-react";
import React, { useState } from "react";
import { tokens } from "@/lib/utils/tokens";
import { Order } from "@/types";

interface SidebarProps {
  orders: Order[];
  activeTab: "orders" | "menu" | "history" | "complaints" | "reviews";
  setActiveTab: (tab: "orders" | "menu" | "history" | "complaints" | "reviews") => void;
  simulateIncomingOrder: (pastSeconds?: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  orders,
  activeTab,
  setActiveTab,
  simulateIncomingOrder,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeOrdersCount = orders.filter((o) => o.status !== "delivered" && o.status !== "rejected").length;

  const menuItems = [
    { id: "orders" as const, label: "Orders", icon: ConciergeBell, hasCount: true },
    { id: "menu" as const, label: "Menu", icon: SquareMenu, hasBadge: true },
    { id: "history" as const, label: "Order history", icon: ClockFading },
    { id: "complaints" as const, label: "Customer complaints", icon: CircleAlert },
    { id: "reviews" as const, label: "Reviews", icon: Star },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r h-full bg-white dark:bg-zinc-900 border-zinc-200/60 dark:border-zinc-800 transition-all duration-300 shrink-0 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-[85%] -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 shadow-sm cursor-pointer dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 text-zinc-500"
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Navigation Links */}
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
                  ? "text-blue-600 dark:text-blue-400 border-r-[3px] border-blue-600 bg-blue-50/40 dark:bg-blue-950/15"
                  : "text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-850 dark:hover:text-zinc-50"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-500 dark:text-zinc-400"}`}
              />

              {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}

              {/* Action Badges / Counts */}
              {item.hasCount &&
                activeOrdersCount > 0 &&
                (isCollapsed ? (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-rose-500" />
                ) : (
                  <span className="ml-auto rounded bg-rose-500 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                    {activeOrdersCount}
                  </span>
                ))}

              {item.hasBadge && !isCollapsed && (
                <span className="ml-auto rounded bg-blue-600 px-1 py-0.5 text-[8px] font-black text-white leading-none">
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Console Demo Controls */}
      <div className={`border-t ${tokens.colors.borderMuted} p-3 pb-10 space-y-2`}>
        {!isCollapsed && (
          <div className="rounded-xl bg-indigo-50/40 p-3 border border-indigo-100/50 dark:bg-indigo-950/10 dark:border-indigo-900/20">
            <h4 className="text-[10px] font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
              Simulator Sandbox
            </h4>
            <p className="text-[9px] text-indigo-900/60 dark:text-indigo-400/70 mt-0.5 leading-snug">
              Inject mock orders to test Firestore sync.
            </p>
            <button
              onClick={() => simulateIncomingOrder()}
              className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 py-1.5 text-[10px] font-bold text-white transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="h-3 w-3" /> Simulate Order
            </button>
            <button
              onClick={() => simulateIncomingOrder(250)}
              className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-rose-600 hover:bg-rose-500 py-1.5 text-[10px] font-bold text-white transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="h-3 w-3" /> Simulate Urgent Order
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
