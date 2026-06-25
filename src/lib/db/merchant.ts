import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { MerchantStatus } from "@/types";
import { FIRESTORE_COLLECTIONS } from "./collections";
import { getFirestoreDb } from "./firebaseClient";
import { stripUndefinedForFirestore } from "./firestoreData";

export const DEFAULT_MERCHANT_ID = "foodrush-main";

export type FirestoreMerchantStatus = "online" | "offline";

export type FirestoreMerchant = {
  id: string;
  name: string;
  status: FirestoreMerchantStatus;
  updatedAt: number;
};

function requireDb() {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firebase is not configured.");
  }
  return db;
}

function toFirestoreStatus(status: MerchantStatus): FirestoreMerchantStatus {
  return status === "Online" ? "online" : "offline";
}

export function toMerchantStatus(status: FirestoreMerchantStatus): MerchantStatus {
  return status === "online" ? "Online" : "Offline";
}

export const subscribeToMerchant = (
  callback: (merchant: FirestoreMerchant) => void,
): (() => void) => {
  const db = requireDb();
  const docRef = doc(db, FIRESTORE_COLLECTIONS.merchants, DEFAULT_MERCHANT_ID);

  return onSnapshot(
    docRef,
    (snapshot) => {
      const data = snapshot.data();
      if (!data) {
        return;
      }

      callback({
        id: DEFAULT_MERCHANT_ID,
        name: typeof data.name === "string" ? data.name : "FoodRush Kitchen",
        status: data.status === "offline" ? "offline" : "online",
        updatedAt: typeof data.updatedAt === "number" ? data.updatedAt : Date.now(),
      });
    },
    (error) => {
      console.error("[Firestore] merchants listener failed.", error);
    },
  );
};

export const ensureMerchantDocument = async (): Promise<void> => {
  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  const docRef = doc(db, FIRESTORE_COLLECTIONS.merchants, DEFAULT_MERCHANT_ID);
  const timestamp = Date.now();

  await setDoc(
    docRef,
    stripUndefinedForFirestore({
      id: DEFAULT_MERCHANT_ID,
      name: "FoodRush Kitchen",
      status: "online",
      updatedAt: timestamp,
    }),
    { merge: true },
  );
};

export const updateMerchantStatus = async (status: MerchantStatus): Promise<void> => {
  const db = requireDb();
  const docRef = doc(db, FIRESTORE_COLLECTIONS.merchants, DEFAULT_MERCHANT_ID);

  await updateDoc(
    docRef,
    stripUndefinedForFirestore({
      status: toFirestoreStatus(status),
      updatedAt: Date.now(),
    }),
  );
};
