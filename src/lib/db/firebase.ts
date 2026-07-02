import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { MenuItem, Order } from "@/types";
import { FIRESTORE_COLLECTIONS } from "./collections";
import { getFirestoreDb } from "./firebaseClient";
import { ensureMerchantDocument } from "./merchant";
import { stripUndefinedForFirestore } from "./firestoreData";
import { generateInventorySeedData } from "./inventorySeedData";
import { ensureMenuItemImage } from "./ensure-menu-item-image";
import { replaceFirestoreInventory, seedFirestoreInventory } from "./seedFirestore";
import { isMenuItem, isOrder } from "./validators";

const SEED_INVENTORY = generateInventorySeedData();

function requireDb() {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error(
      "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local and restart the dev server.",
    );
  }
  return db;
}

export const subscribeToOrders = (callback: (orders: Order[]) => void): (() => void) => {
  const db = requireDb();
  const q = query(collection(db, FIRESTORE_COLLECTIONS.orders), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const orders = snapshot.docs
        .map((docSnap) => {
          const data = docSnap.data();
          const candidate = { ...data, id: data.id || docSnap.id };
          return isOrder(candidate) ? candidate : null;
        })
        .filter((order): order is Order => order !== null);
      callback(orders);
    },
    (error) => {
      console.error(
        `[Firestore] orders listener failed (project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}, database: ${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "(default)"}).`,
        error,
      );
    },
  );
};

export const subscribeToInventory = (callback: (items: MenuItem[]) => void): (() => void) => {
  const db = requireDb();

  return onSnapshot(
    collection(db, FIRESTORE_COLLECTIONS.inventory),
    (snapshot) => {
      const items = snapshot.docs
        .map((docSnap) => {
          const candidate = { id: docSnap.id, ...docSnap.data() };
          return isMenuItem(candidate) ? candidate : null;
        })
        .filter((item): item is MenuItem => item !== null);
      callback(items);
    },
    (error) => {
      console.error(
        `[Firestore] inventory listener failed (project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}, database: ${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "(default)"}).`,
        error,
      );
    },
  );
};

export const addOrder = async (
  order: Omit<Order, "id" | "createdAt" | "updatedAt">,
  pastSeconds?: number,
): Promise<string> => {
  const db = requireDb();
  const timestamp = Date.now() - (pastSeconds || 0) * 1000;
  const id = (6300000000 + Math.floor(Math.random() * 100000000)).toString();

  const newOrder: Order = {
    ...order,
    id,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await setDoc(doc(db, FIRESTORE_COLLECTIONS.orders, id), stripUndefinedForFirestore(newOrder));
  return id;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order["status"],
  extraFields?: Partial<
    Pick<
      Order,
      | "prepTime"
      | "prepStartedAt"
      | "riderName"
      | "riderPhone"
      | "riderOtp"
      | "riderAvatar"
      | "riderCoords"
    >
  >,
): Promise<void> => {
  const db = requireDb();
  const timestamp = Date.now();
  const docRef = doc(db, FIRESTORE_COLLECTIONS.orders, orderId);
  const updates: Partial<
    Pick<
      Order,
      | "status"
      | "updatedAt"
      | "prepTime"
      | "prepStartedAt"
      | "riderName"
      | "riderPhone"
      | "riderOtp"
      | "riderAvatar"
      | "riderCoords"
    >
  > = {
    status,
    updatedAt: timestamp,
    ...extraFields,
  };

  await updateDoc(docRef, stripUndefinedForFirestore(updates));
};

export const updateOrderRiderCoords = async (
  orderId: string,
  riderCoords: [number, number],
): Promise<void> => {
  const db = requireDb();
  await updateDoc(
    doc(db, FIRESTORE_COLLECTIONS.orders, orderId),
    stripUndefinedForFirestore({ riderCoords, updatedAt: Date.now() }),
  );
};

export const updateInventoryStatus = async (
  itemId: string,
  inStock: boolean,
  backInStockTime?: number,
): Promise<void> => {
  const db = requireDb();
  const docRef = doc(db, FIRESTORE_COLLECTIONS.inventory, itemId);

  await updateDoc(docRef, {
    inStock,
    backInStockTime: inStock ? null : backInStockTime || null,
  });
};

export const saveInventoryItem = async (item: MenuItem): Promise<void> => {
  const db = requireDb();
  const docRef = doc(db, FIRESTORE_COLLECTIONS.inventory, item.id);

  const image = await ensureMenuItemImage(item);

  await setDoc(docRef, stripUndefinedForFirestore({ ...item, image }), { merge: true });
};

export const deleteInventoryItem = async (itemId: string): Promise<void> => {
  const db = requireDb();
  await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.inventory, itemId));
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

/** Seeds Firestore inventory when the collection is empty (first connect). */
export const initializeFirestoreData = async (): Promise<void> => {
  const db = getFirestoreDb();
  if (!db) {
    return;
  }
  await seedFirestoreInventory([...SEED_INVENTORY]);
  await ensureMerchantDocument();
};

/** Deletes all inventory and writes the full seed catalog. */
export const reseedFirestoreInventory = async (): Promise<{
  deleted: number;
  written: number;
}> => {
  return replaceFirestoreInventory([...SEED_INVENTORY]);
};
