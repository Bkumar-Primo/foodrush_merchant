import type { Order } from "@/types";
import type { OrderBilling } from "./types";

export function getOrderBilling(order: Order): OrderBilling {
  const isSimulatedLitti = order.items.some((item) => item.name.includes("Litti"));
  const itemTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = 0.0;
  const discount = isSimulatedLitti ? 71.6 : Math.round(itemTotal * 0.1 * 100) / 100;
  const finalBill = isSimulatedLitti ? 644.4 : itemTotal - discount;
  return { isSimulatedLitti, itemTotal, taxes, discount, finalBill };
}

export function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatOrderTime(timestamp: number): string {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}
