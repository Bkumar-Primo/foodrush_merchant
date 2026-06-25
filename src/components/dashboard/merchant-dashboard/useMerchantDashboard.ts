"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInventory } from "@/features/menu/hooks/useInventory";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useAudioChime } from "@/hooks/useAudioChime";
import { STORAGE_KEYS, TIMING } from "@/lib/constants";
import {
  addCategoryMock,
  addSubcategoryMock,
  initializeFirestoreData,
  saveInventoryItem,
  updateInventoryStatus,
  updateOrderRiderCoords,
  updateOrderStatus,
} from "@/lib/db";
import {
  assignRider,
  moveToward,
  RESTAURANT_COORDS,
  riderEnRouteToRestaurant,
} from "@/lib/rider";
import { getFirestoreDb } from "@/lib/db/firebaseClient";
import { updateMerchantStatus } from "@/lib/db/merchant";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { MenuItem, Order, TempAddonGroup } from "@/types";
import { DEFAULT_ADDON_GROUPS } from "./defaultAddonGroups";

const ACTIVE_RIDER_STATUSES: Order["status"][] = [
  "preparing",
  "ready_for_pickup",
  "dispatched",
];

export function useMerchantDashboard() {
  const {
    activeTab,
    setActiveTab,
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
  const backfilledRiderIdsRef = useRef<Set<string>>(new Set());

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

  useEffect(() => {
    void initializeFirestoreData();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.merchantTheme);
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  useEffect(() => {
    for (const order of orders) {
      if (
        order.riderName ||
        !ACTIVE_RIDER_STATUSES.includes(order.status) ||
        backfilledRiderIdsRef.current.has(order.id)
      ) {
        continue;
      }

      backfilledRiderIdsRef.current.add(order.id);
      const rider = assignRider(order.id);
      const riderCoords = riderEnRouteToRestaurant(order.deliveryCoords);
      void updateOrderStatus(order.id, order.status, { ...rider, riderCoords });
    }
  }, [orders]);

  useEffect(() => {
    const trackedOrders = orders.filter(
      (order) =>
        ACTIVE_RIDER_STATUSES.includes(order.status) &&
        order.riderName &&
        order.riderCoords &&
        order.deliveryCoords,
    );
    if (trackedOrders.length === 0) return;

    const interval = setInterval(() => {
      for (const order of trackedOrders) {
        if (!order.riderCoords || !order.deliveryCoords) continue;

        let target: [number, number];
        let fraction: number;

        if (order.status === "preparing") {
          target = RESTAURANT_COORDS;
          fraction = 0.07;
        } else if (order.status === "ready_for_pickup") {
          target = RESTAURANT_COORDS;
          fraction = 0.12;
        } else {
          target = order.deliveryCoords;
          fraction = 0.14;
        }

        const nextCoords = moveToward(order.riderCoords, target, fraction);
        void updateOrderRiderCoords(order.id, nextCoords);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orders]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem(STORAGE_KEYS.merchantTheme, nextTheme);
  };

  const handleAccept = async (orderId: string, prepTime: number) => {
    const order = orders.find((entry) => entry.id === orderId);
    const rider = assignRider(orderId);
    const riderCoords = order
      ? riderEnRouteToRestaurant(order.deliveryCoords)
      : RESTAURANT_COORDS;

    await updateOrderStatus(orderId, "preparing", {
      prepTime,
      prepStartedAt: Date.now(),
      ...rider,
      riderCoords,
    });
    removeMinimizedOrderId(orderId);
    setActiveModalOrderId(null);
    resolveOrderNotification(orderId);
  };

  const handleReady = async (orderId: string) => {
    await updateOrderStatus(orderId, "ready_for_pickup", {
      riderCoords: RESTAURANT_COORDS,
    });
  };

  const handleDispatch = async (orderId: string) => {
    await updateOrderStatus(orderId, "dispatched", {
      riderCoords: RESTAURANT_COORDS,
    });
    setTimeout(async () => {
      await updateOrderStatus(orderId, "delivered");
    }, TIMING.dispatchToDeliveredMs);
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
    if (getFirestoreDb()) {
      void updateMerchantStatus("Online").catch((error) => {
        console.error("[Merchant] Failed to go online.", error);
      });
    }
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
