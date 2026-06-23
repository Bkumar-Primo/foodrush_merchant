"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInventory } from "@/features/menu/hooks/useInventory";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useAudioChime } from "@/hooks/useAudioChime";
import {
  addCategoryMock,
  addOrder,
  addSubcategoryMock,
  saveInventoryItem,
  updateInventoryStatus,
  updateOrderStatus,
} from "@/lib/db";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { MenuItem, TempAddonGroup } from "@/types";
import { DEFAULT_ADDON_GROUPS } from "./defaultAddonGroups";
import { SIMULATE_ORDER_SCENARIOS } from "./simulateOrderScenarios";

export function useMerchantDashboard() {
  const {
    activeTab,
    setActiveTab,
    setSelectedOrderId,
    theme,
    setTheme,
    userProfile,
    activeModalOrderId,
    setActiveModalOrderId,
    minimizedOrderIds,
    addMinimizedOrderId,
    removeMinimizedOrderId,
    addNotification,
    resolveOrderNotification,
    merchantStatus,
    setMerchantStatus,
  } = useDashboardStore();

  const { playOrderChime } = useAudioChime();
  const orders = useOrders(playOrderChime);
  const inventory = useInventory();

  const incomingOrder = orders.find(
    (o) => o.status === "placed" && !minimizedOrderIds.includes(o.id),
  );

  const modalOrder = useMemo(() => {
    if (incomingOrder) return incomingOrder;
    if (activeModalOrderId) {
      return orders.find((o) => o.id === activeModalOrderId && o.status === "placed") ?? null;
    }
    return null;
  }, [incomingOrder, activeModalOrderId, orders]);

  const [showOnlineAlert, setShowOnlineAlert] = useState(false);
  const [addonGroups, setAddonGroups] = useState<TempAddonGroup[]>(DEFAULT_ADDON_GROUPS);
  const simulationIndexRef = useRef(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem("foodrush-merchant-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("foodrush-merchant-theme", nextTheme);
  };

  const handleAccept = async (orderId: string, prepTime: number) => {
    await updateOrderStatus(orderId, "preparing", {
      prepTime,
      prepStartedAt: Date.now(),
    });
    removeMinimizedOrderId(orderId);
    setActiveModalOrderId(null);
    resolveOrderNotification(orderId);
  };

  const handleReady = async (orderId: string) => {
    await updateOrderStatus(orderId, "ready_for_pickup");
  };

  const handleDispatch = async (orderId: string) => {
    await updateOrderStatus(orderId, "dispatched");
    setTimeout(async () => {
      await updateOrderStatus(orderId, "delivered");
    }, 12000);
  };

  const handleToggleStock = async (itemId: string, inStock: boolean, backInStockTime?: number) => {
    await updateInventoryStatus(itemId, inStock, backInStockTime);
  };

  const handleSaveItem = async (item: MenuItem) => {
    await saveInventoryItem(item);
  };

  const handleAddCategory = async (name: string) => {
    await addCategoryMock(name);
  };

  const handleAddSubcategory = async (categoryName: string, subcategoryName: string) => {
    await addSubcategoryMock(categoryName, subcategoryName);
  };

  const simulateIncomingOrder = async (pastSeconds?: number) => {
    if (merchantStatus === "Offline") {
      setShowOnlineAlert(true);
      return;
    }
    const mockOrder =
      SIMULATE_ORDER_SCENARIOS[simulationIndexRef.current % SIMULATE_ORDER_SCENARIOS.length];
    simulationIndexRef.current += 1;
    const newId = await addOrder(mockOrder, pastSeconds);
    setSelectedOrderId(newId);
  };

  const handleMinimizeOrder = (order: (typeof orders)[number]) => {
    addMinimizedOrderId(order.id);
    addNotification({
      title: `New Order #${order.id.slice(-4)}`,
      description: `Incoming order for ${order.items.map((item) => `${item.quantity}x ${item.name}`).join(" + ")}. Awaiting acceptance.`,
      type: "success",
      orderId: order.id,
    });
    setActiveModalOrderId(null);
  };

  const handleGoOnline = () => {
    setMerchantStatus("Online");
    setShowOnlineAlert(false);
  };

  return {
    activeTab,
    setActiveTab,
    theme,
    userProfile,
    toggleTheme,
    orders,
    inventory,
    addonGroups,
    setAddonGroups,
    modalOrder,
    showOnlineAlert,
    setShowOnlineAlert,
    simulateIncomingOrder,
    handleAccept,
    handleReady,
    handleDispatch,
    handleToggleStock,
    handleSaveItem,
    handleAddCategory,
    handleAddSubcategory,
    handleMinimizeOrder,
    handleGoOnline,
    setActiveModalOrderId,
    removeMinimizedOrderId,
    resolveOrderNotification,
  };
}
