import type { MenuItem, Order } from "@/types";

const ORDER_STATUSES = [
  "placed",
  "preparing",
  "ready_for_pickup",
  "dispatched",
  "delivered",
  "rejected",
] as const satisfies readonly Order["status"][];

const FOOD_TYPES = ["veg", "non-veg", "egg"] as const satisfies readonly MenuItem["foodType"][];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCoordPair(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

function isOrderItem(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    typeof value.quantity === "number"
  );
}

export function isOrder(value: unknown): value is Order {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.customerId === "string" &&
    typeof value.customerName === "string" &&
    typeof value.customerPhone === "string" &&
    Array.isArray(value.items) &&
    value.items.every(isOrderItem) &&
    typeof value.totalAmount === "number" &&
    typeof value.status === "string" &&
    ORDER_STATUSES.includes(value.status as Order["status"]) &&
    typeof value.createdAt === "number" &&
    typeof value.updatedAt === "number" &&
    isCoordPair(value.deliveryCoords)
  );
}

export function isMenuItem(value: unknown): value is MenuItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.price === "number" &&
    typeof value.foodType === "string" &&
    FOOD_TYPES.includes(value.foodType as MenuItem["foodType"]) &&
    typeof value.serviceType === "string" &&
    typeof value.category === "string" &&
    typeof value.inStock === "boolean" &&
    typeof value.image === "string"
  );
}

export function isTempAddonGroup(value: unknown): value is import("@/types").TempAddonGroup {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || typeof value.name !== "string") return false;
  if (!Array.isArray(value.options)) return false;
  return value.options.every((opt) => {
    if (!isRecord(opt)) return false;
    return (
      typeof opt.id === "string" && typeof opt.name === "string" && typeof opt.price === "number"
    );
  });
}
