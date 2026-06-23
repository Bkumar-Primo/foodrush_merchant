import { getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  type Firestore,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import type { MenuItem, Order } from "@/types";
import {
  isMenuItem,
  isOrder,
  isSyncMessage,
  parseInventoryJson,
  parseOrdersJson,
} from "./validators";

// Local mock database state (backed by LocalStorage and synchronized via BroadcastChannel)
const MOCK_INVENTORY: MenuItem[] = [
  {
    id: "item_litti_1",
    name: "Litti Chokha",
    description:
      "Indulge in the authentic flavors of Bihar with our litti chokha with ghee dip, offering a delightful blended of smoky and tangy tastes. Each litti is baked to perfection and dipped in pure ghee.",
    price: 139,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Litti Chokha",
    subcategory: "Litti Chokha",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&auto=format&fit=crop&q=60",
    packagingCharge: 15,
    customisable: true,
    variants: [
      {
        id: "var_size",
        name: "Portion Size",
        options: [
          { id: "opt_2", name: "2 Pcs", price: 0 },
          { id: "opt_4", name: "4 Pcs (Full)", price: 100 },
        ],
      },
    ],
    addons: [
      { id: "add_ghee", name: "Extra Ghee Dip", price: 20 },
      { id: "add_chutney", name: "Extra Garlic Chutney", price: 10 },
    ],
  },
  {
    id: "item_litti_2",
    name: "Crispy Tawa Fried Litti",
    description:
      "Deep fried or pan fried litti stuffed with spiced sattu mix, served with spicy baingan and tamatar chokha.",
    price: 179,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Litti Chokha",
    subcategory: "Litti Chokha",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60",
    packagingCharge: 15,
    customisable: true,
  },
  {
    id: "item_litti_3",
    name: "Litti Chokha without Ghee Dip",
    description:
      "For the health-conscious: baked wheat flour balls stuffed with sattu, served dry with our traditional chokha.",
    price: 139,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Litti Chokha",
    subcategory: "Litti Chokha",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=60",
    packagingCharge: 10,
    customisable: true,
  },
  {
    id: "item_litti_4",
    name: "Sattu Poori [4 Poori]",
    description:
      "Fluffy wheat pooris stuffed with seasoned sattu filling, served with a side of aloo chana sabji.",
    price: 139,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Litti Chokha",
    subcategory: "Litti Chokha",
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60",
    packagingCharge: 15,
    customisable: false,
  },
  {
    id: "item_vp_1",
    name: "Classic Mumbai Vada Pav",
    description:
      "Golden fried potato batata vada stuffed inside fresh soft pav, lined with dry garlic chutney.",
    price: 50,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Vada Pav",
    inStock: true,
    image: "🍔",
    packagingCharge: 5,
  },
  {
    id: "item_vp_2",
    name: "Cheese Melt Vada Pav",
    description: "Classic vada pav loaded with liquid cheddar cheese melt.",
    price: 70,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Vada Pav",
    inStock: true,
    image: "🍔",
    packagingCharge: 5,
  },
  {
    id: "item_bread_1",
    name: "Butter Tandoori Roti",
    price: 25,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Bread",
    inStock: true,
    image: "🫓",
  },
  {
    id: "item_bread_2",
    name: "Garlic Butter Naan",
    price: 60,
    foodType: "veg",
    serviceType: "Delivery",
    category: "Bread",
    inStock: true,
    image: "🫓",
  },
  {
    id: "item_ts_1",
    name: "4 Phulka with Bihari Chicken Curry",
    description:
      "4 soft homestyle phulka chapatis served with authentic slow-cooked Bihari style chicken curry in mustard oil.",
    price: 249,
    foodType: "non-veg",
    serviceType: "Delivery",
    category: "Today's Special",
    inStock: true,
    image: "🍛",
    packagingCharge: 20,
  },
  {
    id: "item_ts_2",
    name: "Rice with Bihari Chicken Curry",
    description: "Steaming hot basmati rice served with flavorful Bihari chicken curry.",
    price: 249,
    foodType: "non-veg",
    serviceType: "Delivery",
    category: "Today's Special",
    inStock: true,
    image: "🍛",
    packagingCharge: 20,
  },
  {
    id: "item_ts_3",
    name: "Ghar ka Zaika Special Non Veg Thali",
    description:
      "Complete meal: Rice, 2 Roti, Chicken Curry, Dal, Veg dry sabji, salad, and sweet.",
    price: 299,
    foodType: "non-veg",
    serviceType: "Delivery",
    category: "Today's Special",
    inStock: true,
    image: "🍛",
    packagingCharge: 25,
  },
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

let db: Firestore | null = null;

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
  if (savedOrders) {
    const parsed = parseOrdersJson(savedOrders);
    localOrdersList = parsed.length > 0 ? parsed : [];
  }
  if (!savedOrders || localOrdersList.length === 0) {
    // Populate with the exact orders from the Zomato Order History screenshots
    localOrdersList = [
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
    localStorage.setItem("foodrush_orders", JSON.stringify(localOrdersList));
  }

  // Load initial inventory
  const savedInventory = localStorage.getItem("foodrush_inventory");
  localInventoryList = savedInventory ? parseInventoryJson(savedInventory) : [];
  if (localInventoryList.length === 0) {
    localInventoryList = [...MOCK_INVENTORY];
  }
}

// Order callbacks
const orderListeners = new Set<(orders: Order[]) => void>();
const inventoryListeners = new Set<(items: MenuItem[]) => void>();

if (typeof window !== "undefined" && syncChannel) {
  syncChannel.onmessage = (event) => {
    if (!isSyncMessage(event.data)) return;
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
    syncChannel?.postMessage({
      type: "INVENTORY_UPDATE",
      data: localInventoryList,
    });
  }
  inventoryListeners.forEach((listener) => listener([...localInventoryList]));
};

// Firestore subscriptions
export const subscribeToOrders = (callback: (orders: Order[]) => void): (() => void) => {
  if (db) {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const candidate = { ...data, id: data.id || docSnap.id };
          return isOrder(candidate) ? candidate : null;
        })
        .filter((order): order is Order => order !== null);
      callback(orders);
    });
  } else {
    // Poll the server for orders when Firebase is not configured
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok && active) {
          const serverOrders = await res.json();
          const hasChanges =
            serverOrders.length !== localOrdersList.length ||
            JSON.stringify(serverOrders) !== JSON.stringify(localOrdersList);

          if (hasChanges) {
            localOrdersList = serverOrders;
            localStorage.setItem("foodrush_orders", JSON.stringify(serverOrders));
            orderListeners.forEach((listener) => listener([...localOrdersList]));
            syncChannel?.postMessage({ type: "ORDERS_UPDATE", data: localOrdersList });
          }
        }
      } catch (err) {
        console.error("Failed to poll orders from server:", err);
      }
      if (active) {
        setTimeout(poll, 1500); // Poll every 1.5 seconds
      }
    };

    poll();

    orderListeners.add(callback);
    callback([...localOrdersList]);
    return () => {
      active = false;
      orderListeners.delete(callback);
    };
  }
};

export const subscribeToInventory = (callback: (items: MenuItem[]) => void): (() => void) => {
  if (db) {
    return onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) => {
          const candidate = { id: docSnap.id, ...docSnap.data() };
          return isMenuItem(candidate) ? candidate : null;
        })
        .filter((item): item is MenuItem => item !== null);
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
  const id = (6300000000 + Math.floor(Math.random() * 100000000)).toString();

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
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });
    } catch (err) {
      console.error("Failed to send order to server:", err);
    }
    localOrdersList = [newOrder, ...localOrdersList];
    notifyOrderListeners();
    return id;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  extraFields?: Partial<Pick<Order, "prepTime" | "prepStartedAt">>,
): Promise<void> => {
  const timestamp = Date.now();

  if (db) {
    const docRef = doc(db, "orders", orderId);
    const updates: Partial<Pick<Order, "status" | "updatedAt" | "prepTime" | "prepStartedAt">> = {
      status,
      updatedAt: timestamp,
      ...extraFields,
    };
    await updateDoc(docRef, updates);
  } else {
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extraFields }),
      });
    } catch (err) {
      console.error("Failed to update order status on server:", err);
    }
    localOrdersList = localOrdersList.map((o) => {
      if (o.id === orderId) {
        const updated: Order = {
          ...o,
          status,
          updatedAt: timestamp,
          ...extraFields,
        };
        return updated;
      }
      return o;
    });
    notifyOrderListeners();
  }
};

export const updateInventoryStatus = async (
  itemId: string,
  inStock: boolean,
  backInStockTime?: number,
): Promise<void> => {
  if (db) {
    const docRef = doc(db, "inventory", itemId);
    await updateDoc(docRef, {
      inStock,
      backInStockTime: inStock ? null : backInStockTime || null,
    });
  } else {
    localInventoryList = localInventoryList.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          inStock,
          backInStockTime: inStock ? undefined : backInStockTime,
        };
      }
      return item;
    });
    notifyInventoryListeners();
  }
};

export const saveInventoryItem = async (item: MenuItem): Promise<void> => {
  if (db) {
    const docRef = doc(db, "inventory", item.id);
    await updateDoc(docRef, { ...item });
  } else {
    let exists = false;
    localInventoryList = localInventoryList.map((existing) => {
      if (existing.id === item.id) {
        exists = true;
        return item;
      }
      return existing;
    });
    if (!exists) {
      const newItem = {
        ...item,
        id: item.id || `item_${Math.floor(1000 + Math.random() * 9000)}`,
      };
      localInventoryList = [...localInventoryList, newItem];
    }
    notifyInventoryListeners();
  }
};

export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  if (db) {
    const docRef = doc(db, "inventory", itemId);
    await deleteDoc(docRef);
  } else {
    localInventoryList = localInventoryList.filter((item) => item.id !== itemId);
    notifyInventoryListeners();
  }
};

export const addCategoryMock = async (categoryName: string): Promise<void> => {
  void categoryName;
  return Promise.resolve();
};

export const addSubcategoryMock = async (
  categoryName: string,
  subcategoryName: string,
): Promise<void> => {
  void categoryName;
  void subcategoryName;
  return Promise.resolve();
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
