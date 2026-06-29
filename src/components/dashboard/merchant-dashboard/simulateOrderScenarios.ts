import type { Order } from "@/types";

type SimulateOrderPayload = Omit<Order, "id" | "createdAt" | "updatedAt">;

export const SIMULATE_ORDER_SCENARIOS: SimulateOrderPayload[] = [
  {
    customerId: "cust_3127",
    customerName: "Khatri Ravi",
    customerPhone: "+91 98765 43210",
    items: [{ id: "item_001", name: "Aloo Paratha with Curd", price: 89, quantity: 2 }],
    totalAmount: 178,
    status: "placed",
    deliveryCoords: [12.9715987, 77.5945627],
  },
  {
    customerId: "cust_5166",
    customerName: "Abhishek",
    customerPhone: "+91 91111 22222",
    items: [
      { id: "item_077", name: "Butter Chicken", price: 229, quantity: 1 },
      { id: "item_120", name: "Butter Naan", price: 35, quantity: 2 },
    ],
    totalAmount: 299,
    status: "placed",
    deliveryCoords: [12.9715987, 77.5945627],
  },
  {
    customerId: "cust_9988",
    customerName: "Rahul Roy",
    customerPhone: "+91 93333 44444",
    items: [{ id: "item_chicken_roll", name: "Chicken Tikka Roll", price: 180, quantity: 2 }],
    totalAmount: 360,
    status: "placed",
    deliveryCoords: [12.9715987, 77.5945627],
  },
];
