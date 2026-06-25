import type { Order } from "@/types";

type SimulateOrderPayload = Omit<Order, "id" | "createdAt" | "updatedAt">;

export const SIMULATE_ORDER_SCENARIOS: SimulateOrderPayload[] = [
  {
    customerId: "cust_3127",
    customerName: "Khatri Ravi",
    customerPhone: "+91 98765 43210",
    items: [{ id: "item_litti", name: "Crispy Tawa Fried Litti", price: 179, quantity: 4 }],
    totalAmount: 716,
    status: "placed",
    deliveryCoords: [12.9715987, 77.5945627],
  },
  {
    customerId: "cust_5166",
    customerName: "Abhishek",
    customerPhone: "+91 91111 22222",
    items: [
      { id: "item_litti_chokha", name: "Litti Chokha", price: 147, quantity: 1 },
      { id: "item_ghee", name: "Add On: Ghee", price: 0, quantity: 1 },
      { id: "item_omelette", name: "Omelette", price: 59, quantity: 1 },
    ],
    totalAmount: 206,
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
