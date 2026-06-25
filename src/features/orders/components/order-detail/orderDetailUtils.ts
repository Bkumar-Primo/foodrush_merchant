import type { Order, OrderItem } from "@/types";
import { getRiderForOrder } from "@/lib/rider";

const NON_VEG_KEYWORDS = ["chicken", "omelette", "egg", "mutton", "fish", "kebab"] as const;

export interface SimulatedRider {
  name: string;
  avatar: string;
  otp: number;
}

export type OrderDietType = "veg" | "non-veg" | "mixed";

export interface OrderBill {
  total: number;
  discount: number;
  final: number;
}

export function getSimulatedRider(order: Order): SimulatedRider | null {
  const rider = getRiderForOrder(order);
  if (!rider) return null;
  return { name: rider.name, avatar: rider.avatar, otp: rider.otp };
}

export function formatCountdown(mins: number, secs: number): string {
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function itemNameIncludesNonVeg(name: string): boolean {
  const lowerName = name.toLowerCase();
  return NON_VEG_KEYWORDS.some((keyword) => lowerName.includes(keyword));
}

export function isItemVeg(item: OrderItem): boolean {
  return !itemNameIncludesNonVeg(item.name);
}

export function getOrderDietType(items: OrderItem[]): OrderDietType {
  const hasVeg = items.some((item) => !itemNameIncludesNonVeg(item.name));
  const hasNonVeg = items.some((item) => itemNameIncludesNonVeg(item.name));

  if (hasVeg && hasNonVeg) return "mixed";
  if (hasNonVeg) return "non-veg";
  return "veg";
}

export function calculateOrderBill(items: OrderItem[]): OrderBill {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(total * 0.1 * 100) / 100;
  return { total, discount, final: total - discount };
}

export function getPlacedTimeDisplay(now: number, createdAt: number): string {
  const elapsedMins = Math.floor((now - createdAt) / 60000);
  if (elapsedMins < 60) {
    return `${elapsedMins} mins ago`;
  }
  return new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function getPrepTimers(
  now: number,
  order: Order,
): { remainingSecs: number; remainingMins: number; remainingSecsRem: number } {
  const prepTimeMins = order.prepTime ?? 40;
  const prepStartedAt = order.prepStartedAt ?? order.createdAt;
  const remainingSecs = Math.max(0, Math.ceil(prepTimeMins * 60 - (now - prepStartedAt) / 1000));
  return {
    remainingSecs,
    remainingMins: Math.floor(remainingSecs / 60),
    remainingSecsRem: remainingSecs % 60,
  };
}

export function getReadyTimers(
  now: number,
  updatedAt: number,
): {
  elapsedSecs: number;
  remainingSecs: number;
  remainingMins: number;
  remainingSecsRem: number;
  handoverProgress: number;
  lateMins: number;
  lateSecsRem: number;
} {
  const elapsedSecs = Math.floor((now - updatedAt) / 1000);
  const remainingSecs = Math.max(0, 180 - elapsedSecs);
  const lateSecs = Math.max(0, elapsedSecs - 180);
  return {
    elapsedSecs,
    remainingSecs,
    remainingMins: Math.floor(remainingSecs / 60),
    remainingSecsRem: remainingSecs % 60,
    handoverProgress: Math.min(100, (elapsedSecs / 180) * 100),
    lateMins: Math.floor(lateSecs / 60),
    lateSecsRem: lateSecs % 60,
  };
}

export function isRiderArrived(now: number, createdAt: number): boolean {
  const elapsedSecs = Math.floor((now - createdAt) / 1000);
  return elapsedSecs > 15;
}
