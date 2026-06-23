import { useEffect, useRef, useState } from "react";
import { subscribeToOrders } from "@/lib/db";
import type { Order } from "@/types";

export const useOrders = (onNewOrder?: () => void) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const knownPlacedOrderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let initialLoad = true;
    const unsubscribe = subscribeToOrders((newOrders) => {
      const placedOrders = newOrders.filter((order) => order.status === "placed");
      const placedIds = new Set(placedOrders.map((order) => order.id));

      if (!initialLoad && onNewOrder) {
        const hasNewPlacedOrder = placedOrders.some(
          (order) => !knownPlacedOrderIdsRef.current.has(order.id),
        );
        if (hasNewPlacedOrder) {
          onNewOrder();
        }
      }

      knownPlacedOrderIdsRef.current = placedIds;
      setOrders(newOrders);
      initialLoad = false;
    });
    return unsubscribe;
  }, [onNewOrder]);

  return orders;
};
