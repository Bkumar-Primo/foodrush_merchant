import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, writeBatch } from "firebase/firestore";
import { stripUndefinedForFirestore } from "../src/lib/db/firestoreData";
import { generateInventorySeedData } from "../src/lib/db/inventorySeedData";

const BATCH_LIMIT = 500;
const INVENTORY_COLLECTION = "inventory";

function loadEnvLocal(): Record<string, string> {
  const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env.local");
  const content = readFileSync(envPath, "utf8");
  const env: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }

  return env;
}

async function commitInChunks<T>(
  items: T[],
  apply: (batch: ReturnType<typeof writeBatch>, item: T) => void,
  db: ReturnType<typeof getFirestore>,
): Promise<void> {
  for (let i = 0; i < items.length; i += BATCH_LIMIT) {
    const chunk = items.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);
    for (const item of chunk) {
      apply(batch, item);
    }
    await batch.commit();
  }
}

async function main(): Promise<void> {
  const env = loadEnvLocal();
  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID missing in .env.local");
  }

  const app = initializeApp({
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });

  const databaseId = env.NEXT_PUBLIC_FIREBASE_DATABASE_ID?.trim() || "(default)";
  const db = getFirestore(app, databaseId);
  const items = generateInventorySeedData();

  console.log(`Project: ${projectId} | Database: ${databaseId}`);
  console.log(`Deleting existing inventory...`);

  const existing = await getDocs(collection(db, INVENTORY_COLLECTION));
  const existingDocs = existing.docs;

  if (existingDocs.length > 0) {
    await commitInChunks(
      existingDocs,
      (batch, docSnap) => {
        batch.delete(docSnap.ref);
      },
      db,
    );
    console.log(`Deleted ${existingDocs.length} documents.`);
  } else {
    console.log("No existing documents to delete.");
  }

  console.log(`Writing ${items.length} new menu items...`);

  await commitInChunks(
    items,
    (batch, item) => {
      batch.set(doc(db, INVENTORY_COLLECTION, item.id), stripUndefinedForFirestore(item));
    },
    db,
  );

  console.log(`Done. ${items.length} items written to Firestore inventory.`);
}

main().catch((error) => {
  console.error("Reseed failed:", error);
  process.exit(1);
});
