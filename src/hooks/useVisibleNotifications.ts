"use client";

import { useEffect, useMemo } from "react";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useNow } from "@/hooks/useNow";
import { type NotificationItem, useDashboardStore } from "@/stores/useDashboardStore";

const ORDER_TIMEOUT_SECONDS = 300;

function isNotificationVisible(
  item: NotificationItem,
  orders: ReturnType<typeof useOrders>,
  now: number,
): boolean {
  if (!item.orderId) return true;
  const order = orders.find((o) => o.id === item.orderId);
  if (!order) return true;
  if (order.status !== "placed") return true;
  const timeLeft = ORDER_TIMEOUT_SECONDS - Math.floor((now - order.createdAt) / 1000);
  return timeLeft > 0;
}

export function useVisibleNotifications() {
  const { notifications, setNotifications } = useDashboardStore();
  const orders = useOrders();
  const now = useNow();

  const visibleNotifications = useMemo(
    () => notifications.filter((item) => isNotificationVisible(item, orders, now)),
    [notifications, orders, now],
  );

  useEffect(() => {
    const expiredIds = notifications
      .filter((item) => {
        if (!item.orderId) return false;
        const order = orders.find((o) => o.id === item.orderId);
        if (order?.status !== "placed") return false;
        const timeLeft = ORDER_TIMEOUT_SECONDS - Math.floor((now - order.createdAt) / 1000);
        return timeLeft <= 0;
      })
      .map((n) => n.id);

    if (expiredIds.length > 0) {
      queueMicrotask(() => {
        setNotifications(notifications.filter((n) => !expiredIds.includes(n.id)));
      });
    }
  }, [notifications, orders, now, setNotifications]);

  return { visibleNotifications, orders, now };
}

export function getOrderTimeLeft(orderCreatedAt: number, now: number): number {
  return ORDER_TIMEOUT_SECONDS - Math.floor((now - orderCreatedAt) / 1000);
}
