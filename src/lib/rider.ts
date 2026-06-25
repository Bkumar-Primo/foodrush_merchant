import type { Order } from "@/types";

export const RIDER_POOL = [
  { name: "Chandan", phone: "9876543210", avatar: "/images/avatar.png" },
  { name: "Vishwanatha", phone: "9876543211", avatar: "/images/avatar.png" },
  { name: "Rahul", phone: "9876543212", avatar: "/images/avatar.png" },
  { name: "Suresh", phone: "9876543213", avatar: "/images/avatar.png" },
  { name: "Amit", phone: "9876543214", avatar: "/images/avatar.png" },
] as const;

export const RESTAURANT_COORDS: [number, number] = [12.9698, 77.75];

export type AssignedRider = {
  riderName: string;
  riderPhone: string;
  riderOtp: number;
  riderAvatar: string;
};

function hashOrderId(orderId: string): number {
  return orderId.split("").reduce((accumulator, character) => {
    return accumulator + character.charCodeAt(0);
  }, 0);
}

export function assignRider(orderId: string): AssignedRider {
  const hash = hashOrderId(orderId);
  const rider = RIDER_POOL[hash % RIDER_POOL.length];
  return {
    riderName: rider.name,
    riderPhone: rider.phone,
    riderOtp: 1000 + (hash % 9000),
    riderAvatar: rider.avatar,
  };
}

export function getRiderForOrder(
  order: Order,
): (AssignedRider & { name: string; otp: number; avatar: string }) | null {
  if (!order.riderName) {
    return null;
  }

  return {
    name: order.riderName,
    riderName: order.riderName,
    riderPhone: order.riderPhone ?? "",
    riderOtp: order.riderOtp ?? 0,
    riderAvatar: order.riderAvatar ?? "/images/avatar.png",
    otp: order.riderOtp ?? 0,
    avatar: order.riderAvatar ?? "/images/avatar.png",
  };
}

export function riderEnRouteToRestaurant(
  deliveryCoords: [number, number],
): [number, number] {
  return [
    RESTAURANT_COORDS[0] + (deliveryCoords[0] - RESTAURANT_COORDS[0]) * 0.55,
    RESTAURANT_COORDS[1] + (deliveryCoords[1] - RESTAURANT_COORDS[1]) * 0.55,
  ];
}

export function initialRiderCoords(deliveryCoords: [number, number]): [number, number] {
  return [
    RESTAURANT_COORDS[0] + (deliveryCoords[0] - RESTAURANT_COORDS[0]) * 0.35,
    RESTAURANT_COORDS[1] + (deliveryCoords[1] - RESTAURANT_COORDS[1]) * 0.35,
  ];
}

export function moveToward(
  from: [number, number],
  to: [number, number],
  fraction: number,
): [number, number] {
  return [
    from[0] + (to[0] - from[0]) * fraction,
    from[1] + (to[1] - from[1]) * fraction,
  ];
}
