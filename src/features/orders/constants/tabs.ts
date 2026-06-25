import type { OrderStatus, OrderTab } from "@/types";

export interface OrderPageTab {
  key: OrderTab;
  label: string;
  status: OrderStatus;
}

export const ORDER_PAGE_TABS: OrderPageTab[] = [
  { key: "preparing", label: "Preparing", status: "preparing" },
  { key: "ready", label: "Ready", status: "ready_for_pickup" },
  { key: "picked_up", label: "Picked up", status: "dispatched" },
];
