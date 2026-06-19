import { getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";

import { MenuItem, Order } from "@/types";

// Local mock database state (backed by LocalStorage and synchronized via BroadcastChannel)
const MOCK_INVENTORY: MenuItem[] = [
  {
    id: "item_1",
    name: "Butter Chicken Meal",
    price: 320,
    category: "Mains",
    inStock: true,
    image: "🍗",
  },
  {
    id: "item_2",
    name: "Paneer Tikka Roll",
    price: 180,
    category: "Rolls",
    inStock: true,
    image: "🌯",
  },
  {
    id: "item_3",
    name: "Masala Dosa",
    price: 120,
    category: "South Indian",
    inStock: true,
    image: "🥞",
  },
  {
    id: "item_4",
    name: "Special Veg Biryani",
    price: 260,
    category: "Biryanis",
    inStock: true,
    image: "🍚",
  },
  {
    id: "item_5",
    name: "Gulab Jamun (2 Pcs)",
    price: 80,
    category: "Desserts",
    inStock: true,
    image: "🍨",
  },
  { id: "item_6", name: "Mango Lassi", price: 90, category: "Drinks", inStock: true, image: "🥛" },
];

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isRealFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let db: any = null;

if (isRealFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed, falling back to local database:", error);
  }
}

// Multi-tab sync channel
let syncChannel: BroadcastChannel | null = null;
if (typeof window !== "undefined") {
  syncChannel = new BroadcastChannel("foodrush_sync_channel");
}

// Memory database fallback
let localOrdersList: Order[] = [];
let localInventoryList: MenuItem[] = [];

if (typeof window !== "undefined") {
  // Load initial orders
  const savedOrders = localStorage.getItem("foodrush_orders");
  localOrdersList = savedOrders ? JSON.parse(savedOrders) : [];

  // Load initial inventory
  const savedInventory = localStorage.getItem("foodrush_inventory");
  localInventoryList = savedInventory ? JSON.parse(savedInventory) : MOCK_INVENTORY;
}

// Order callbacks
const orderListeners = new Set<(orders: Order[]) => void>();
const inventoryListeners = new Set<(items: MenuItem[]) => void>();

if (typeof window !== "undefined" && syncChannel) {
  syncChannel.onmessage = (event) => {
    const { type, data } = event.data;
    if (type === "ORDERS_UPDATE") {
      localOrdersList = data;
      localStorage.setItem("foodrush_orders", JSON.stringify(data));
      orderListeners.forEach((listener) => listener([...localOrdersList]));
    } else if (type === "INVENTORY_UPDATE") {
      localInventoryList = data;
      localStorage.setItem("foodrush_inventory", JSON.stringify(data));
      inventoryListeners.forEach((listener) => listener([...localInventoryList]));
    }
  };
}

const notifyOrderListeners = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("foodrush_orders", JSON.stringify(localOrdersList));
    syncChannel?.postMessage({ type: "ORDERS_UPDATE", data: localOrdersList });
  }
  orderListeners.forEach((listener) => listener([...localOrdersList]));
};

const notifyInventoryListeners = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("foodrush_inventory", JSON.stringify(localInventoryList));
    syncChannel?.postMessage({ type: "INVENTORY_UPDATE", data: localInventoryList });
  }
  inventoryListeners.forEach((listener) => listener([...localInventoryList]));
};

// Firestore subscriptions
export const subscribeToOrders = (callback: (orders: Order[]) => void): (() => void) => {
  if (db) {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, id: data.id || doc.id } as Order;
      });
      callback(orders);
    });
  } else {
    orderListeners.add(callback);
    callback([...localOrdersList]);
    return () => {
      orderListeners.delete(callback);
    };
  }
};

export const subscribeToInventory = (callback: (items: MenuItem[]) => void): (() => void) => {
  if (db) {
    return onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as MenuItem);
      callback(items);
    });
  } else {
    inventoryListeners.add(callback);
    callback([...localInventoryList]);
    return () => {
      inventoryListeners.delete(callback);
    };
  }
};

// Database Mutations
export const addOrder = async (
  order: Omit<Order, "id" | "createdAt" | "updatedAt">,
  pastSeconds?: number,
): Promise<string> => {
  const timestamp = Date.now() - (pastSeconds || 0) * 1000;
  const id = Math.floor(1000 + Math.random() * 9000).toString();

  const newOrder: Order = {
    ...order,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (db) {
    await addDoc(collection(db, "orders"), newOrder);
    return id;
  } else {
    localOrdersList = [newOrder, ...localOrdersList];
    notifyOrderListeners();
    return id;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  extraFields?: Record<string, any>,
): Promise<void> => {
  const timestamp = Date.now();

  if (db) {
    const docRef = doc(db, "orders", orderId);
    const updates: any = { status, updatedAt: timestamp, ...extraFields };
    await updateDoc(docRef, updates);
  } else {
    localOrdersList = localOrdersList.map((o) => {
      if (o.id === orderId) {
        const updated: Order = { ...o, status, updatedAt: timestamp, ...extraFields };
        return updated;
      }
      return o;
    });
    notifyOrderListeners();
  }
};

export const updateInventoryStatus = async (itemId: string, inStock: boolean): Promise<void> => {
  if (db) {
    const docRef = doc(db, "inventory", itemId);
    await updateDoc(docRef, { inStock });
  } else {
    localInventoryList = localInventoryList.map((item) => {
      if (item.id === itemId) {
        return { ...item, inStock };
      }
      return item;
    });
    notifyInventoryListeners();
  }
};

// Helper to clear localStorage database for debug
export const clearLocalDatabase = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("foodrush_orders");
    localStorage.removeItem("foodrush_inventory");
    localOrdersList = [];
    localInventoryList = [...MOCK_INVENTORY];
    notifyOrderListeners();
    notifyInventoryListeners();
  }
};
