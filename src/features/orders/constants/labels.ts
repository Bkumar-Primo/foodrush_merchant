import type { HistoryStatus, OrderStatus } from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Placed",
  preparing: "Preparing",
  ready_for_pickup: "Ready",
  dispatched: "Picked up",
  delivered: "Delivered",
  rejected: "Rejected",
};

export const HISTORY_STATUS_LABELS: Record<HistoryStatus, string> = {
  delivered: "Delivered",
  rejected: "Rejected",
};

export const ORDER_TIMELINE_LABELS = {
  placed: "Placed",
  accepted: "Accepted",
  arrived: "Delivery partner arrived",
  ready: "Ready",
  picked: "Picked up",
  delivered: "Delivered",
  rejected: "Rejected",
} as const;

export const ORDER_REJECTION_REASONS = [
  "Rejected by customer",
  "Item unavailable",
  "Kitchen closed",
] as const;

export const ORDER_HISTORY_COPY = {
  pageTitle: "Order History",
  allOrders: "All orders",
  orderTimeline: "Order timeline",
} as const;
