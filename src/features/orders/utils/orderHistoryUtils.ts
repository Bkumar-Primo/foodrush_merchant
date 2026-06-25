import { ORDER_REJECTION_REASONS, ORDER_TIMELINE_LABELS } from "@/features/orders/constants";
import { getRiderForOrder } from "@/lib/rider";
import type { Order } from "@/types";

export interface TimelineStep {
  key: string;
  label: string;
  timestamp: number | null;
  showView?: boolean;
}

export function getSimulatedRider(order: Order) {
  const rider = getRiderForOrder(order);
  if (!rider) return null;
  return { name: rider.name, avatar: rider.avatar };
}

export function getSimulatedRating(orderId: string): number | null {
  const hash = orderId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  if (hash % 5 === 0) return null;
  return 3 + (hash % 3);
}

export function formatHistoryTime(ts: number) {
  return new Date(ts).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatHistoryDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
}

export function formatShortDateRange(start: Date, end: Date) {
  const startDay = start.getDate();
  const endDay = end.getDate();
  const suffix = (n: number) => {
    if (n >= 11 && n <= 13) return "th";
    return ["th", "st", "nd", "rd"][n % 10 > 3 ? 0 : n % 10] ?? "th";
  };
  const startMonth = start.toLocaleDateString("en-GB", { month: "short" });
  const endMonth = end.toLocaleDateString("en-GB", { month: "short" });
  if (startMonth === endMonth) {
    return `${startDay}${suffix(startDay)} to ${endDay}${suffix(endDay)} ${startMonth}`;
  }
  return `${startDay}${suffix(startDay)} ${startMonth} to ${endDay}${suffix(endDay)} ${endMonth}`;
}

export function getItemsSummary(order: Order) {
  return order.items.map((i) => `${i.quantity} x ${i.name}`).join(", ");
}

export function getBillTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getRejectionReason(order: Order) {
  const hash = order.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ORDER_REJECTION_REASONS[hash % ORDER_REJECTION_REASONS.length];
}

export function buildTimeline(order: Order): TimelineStep[] {
  const placed = order.createdAt;
  const prepStart = order.prepStartedAt ?? placed + 60_000;
  const ready = prepStart + (order.prepTime ?? 15) * 60_000;
  const arrived = ready - 3 * 60_000;
  const pickedUp = ready + 5 * 60_000;
  const delivered = order.status === "delivered" ? order.updatedAt : null;

  if (order.status === "rejected") {
    return [
      { key: "placed", label: ORDER_TIMELINE_LABELS.placed, timestamp: placed },
      { key: "rejected", label: ORDER_TIMELINE_LABELS.rejected, timestamp: order.updatedAt },
    ];
  }

  return [
    { key: "placed", label: ORDER_TIMELINE_LABELS.placed, timestamp: placed },
    {
      key: "accepted",
      label: ORDER_TIMELINE_LABELS.accepted,
      timestamp: prepStart,
      showView: true,
    },
    { key: "arrived", label: ORDER_TIMELINE_LABELS.arrived, timestamp: arrived },
    { key: "ready", label: ORDER_TIMELINE_LABELS.ready, timestamp: ready, showView: true },
    { key: "picked", label: ORDER_TIMELINE_LABELS.picked, timestamp: pickedUp },
    { key: "delivered", label: ORDER_TIMELINE_LABELS.delivered, timestamp: delivered },
  ];
}

export function getDeliveryDurationMins(order: Order) {
  if (order.status !== "delivered") return null;
  return Math.max(1, Math.round((order.updatedAt - order.createdAt) / 60_000));
}

export function getCustomerLocality(order: Order) {
  const localities = [
    "Kumbena Agrahara, Krishnarajapura, Bengaluru (4 kms, 15 mins away)",
    "TC Palya, KR Puram (1 km, 7 mins away)",
    "Whitefield, Bengaluru (6 kms, 20 mins away)",
  ];
  const hash = order.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return localities[hash % localities.length];
}

export function getCustomerOrderCount(order: Order) {
  const hash = order.customerId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return 1 + (hash % 12);
}

export function isTerminalOrder(order: Order) {
  return order.status === "delivered" || order.status === "rejected";
}

export function exportOrdersCsv(orders: Order[]) {
  const headers = ["Order ID", "Customer", "Status", "Items", "Total", "Date"];
  const rows = orders.map((o) => [
    o.id,
    o.customerName,
    o.status.toUpperCase(),
    getItemsSummary(o),
    getBillTotal(o).toFixed(2),
    new Date(o.updatedAt).toISOString(),
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `order-history-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
