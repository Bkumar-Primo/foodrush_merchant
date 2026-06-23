import fs from "node:fs/promises";
import path from "node:path";
import type { Order } from "@/types";

const DB_FILE_PATH = path.join(process.cwd(), "local_orders_db.json");

const DEFAULT_ORDERS: Order[] = [
  {
    id: "6317231376",
    customerId: "cust_santosh",
    customerName: "T Santosh Kumar",
    customerPhone: "+91 98765 43210",
    items: [
      {
        id: "item_litti_no_ghee",
        name: "Litti Chokha without Ghee Dip",
        price: 159,
        quantity: 1,
      },
      {
        id: "item_poha",
        name: "Poha",
        price: 89,
        quantity: 1,
      },
    ],
    totalAmount: 248,
    status: "delivered",
    createdAt: 1730562720000, // 2 Nov 2024, 9:22 PM
    updatedAt: 1730565360000, // 2 Nov 2024, 10:06 PM
    deliveryCoords: [12.9715987, 77.5945627],
    prepTime: 15,
    prepStartedAt: 1730562780000,
  },
  {
    id: "6321605839",
    customerId: "cust_santosh",
    customerName: "T Santosh Kumar",
    customerPhone: "+91 98765 43210",
    items: [
      {
        id: "item_poha",
        name: "Poha",
        price: 109,
        quantity: 1,
      },
    ],
    totalAmount: 109,
    status: "rejected",
    createdAt: 1730562540000, // 2 Nov 2024, 9:19 PM
    updatedAt: 1730562600000,
    deliveryCoords: [12.9715987, 77.5945627],
  },
  {
    id: "6321799304",
    customerId: "cust_jagannath",
    customerName: "Jagannath Barik",
    customerPhone: "+91 99999 88888",
    items: [
      {
        id: "item_litti_no_ghee",
        name: "Litti Chokha without Ghee Dip",
        price: 159,
        quantity: 1,
      },
    ],
    totalAmount: 159,
    status: "delivered",
    createdAt: 1730480640000, // 1 Nov 2024, 10:34 PM
    updatedAt: 1730482440000,
    deliveryCoords: [12.9715987, 77.5945627],
    prepTime: 15,
    prepStartedAt: 1730480700000,
  },
];

export async function getOrders(): Promise<Order[]> {
  try {
    const data = await fs.readFile(DB_FILE_PATH, "utf-8");
    return JSON.parse(data) as Order[];
  } catch {
    // If file doesn't exist, create it with default orders
    await saveOrders(DEFAULT_ORDERS);
    return DEFAULT_ORDERS;
  }
}

export async function saveOrders(orders: Order[]): Promise<void> {
  await fs.writeFile(DB_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export async function addServerOrder(order: Order): Promise<void> {
  const orders = await getOrders();
  // Add to start of list (matching desc order)
  orders.unshift(order);
  await saveOrders(orders);
}

export async function updateServerOrderStatus(
  orderId: string,
  status: Order["status"],
  extraFields?: Partial<Pick<Order, "prepTime" | "prepStartedAt">>,
): Promise<boolean> {
  const orders = await getOrders();
  let updated = false;
  const updatedOrders = orders.map((o) => {
    if (o.id === orderId) {
      updated = true;
      return {
        ...o,
        status,
        updatedAt: Date.now(),
        ...extraFields,
      };
    }
    return o;
  });
  if (updated) {
    await saveOrders(updatedOrders);
  }
  return updated;
}
