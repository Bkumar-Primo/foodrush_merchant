import { collection, doc, getDocs, limit, query, writeBatch } from "firebase/firestore";
import type { MenuItem } from "@/types";
import { FIRESTORE_COLLECTIONS } from "./collections";
import { getFirestoreDb } from "./firebaseClient";
import { stripUndefinedForFirestore } from "./firestoreData";

const FIRESTORE_BATCH_LIMIT = 500;

async function commitBatches(
  db: NonNullable<ReturnType<typeof getFirestoreDb>>,
  operations: Array<(batch: ReturnType<typeof writeBatch>) => void>,
): Promise<void> {
  for (let i = 0; i < operations.length; i += FIRESTORE_BATCH_LIMIT) {
    const chunk = operations.slice(i, i + FIRESTORE_BATCH_LIMIT);
    const batch = writeBatch(db);
    for (const op of chunk) {
      op(batch);
    }
    await batch.commit();
  }
}

export async function deleteAllFirestoreInventory(): Promise<number> {
  const db = getFirestoreDb();
  if (!db) {
    return 0;
  }

  const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTIONS.inventory));
  if (snapshot.empty) {
    return 0;
  }

  const deleteOps = snapshot.docs.map((docSnap) => (batch: ReturnType<typeof writeBatch>) => {
    batch.delete(docSnap.ref);
  });

  await commitBatches(db, deleteOps);
  return snapshot.size;
}

export async function writeFirestoreInventory(items: MenuItem[]): Promise<number> {
  const db = getFirestoreDb();
  if (!db || items.length === 0) {
    return 0;
  }

  const writeOps = items.map((item) => (batch: ReturnType<typeof writeBatch>) => {
    batch.set(doc(db, FIRESTORE_COLLECTIONS.inventory, item.id), stripUndefinedForFirestore(item));
  });

  await commitBatches(db, writeOps);
  return items.length;
}

/** Seeds Firestore inventory only when the collection is empty. */
export async function seedFirestoreInventory(items: MenuItem[]): Promise<boolean> {
  const db = getFirestoreDb();
  if (!db || items.length === 0) {
    return false;
  }

  try {
    const inventoryRef = collection(db, FIRESTORE_COLLECTIONS.inventory);
    const existing = await getDocs(query(inventoryRef, limit(1)));
    if (!existing.empty) {
      return false;
    }

    await writeFirestoreInventory(items);
    return true;
  } catch (error) {
    console.error(
      "[Firestore] inventory seed failed — publish rules on the correct database in Firebase Console → Firestore → Rules.",
      error,
    );
    return false;
  }
}

/** Deletes all inventory documents and writes a fresh seed set. */
export async function replaceFirestoreInventory(items: MenuItem[]): Promise<{
  deleted: number;
  written: number;
}> {
  const db = getFirestoreDb();
  if (!db) {
    return { deleted: 0, written: 0 };
  }

  const deleted = await deleteAllFirestoreInventory();
  const written = await writeFirestoreInventory(items);
  return { deleted, written };
}
