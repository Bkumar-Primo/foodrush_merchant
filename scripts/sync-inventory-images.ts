import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, writeBatch } from "firebase/firestore";
import { getCategoryImagePathMap, resolveFoodCategoryImagePath } from "../src/lib/constants/food-category-images";
import { stripUndefinedForFirestore } from "../src/lib/db/firestoreData";

const BATCH_LIMIT = 400;
const INVENTORY_COLLECTION = "inventory";
const MERCHANT_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://foodrush-merchant.vercel.app";

function loadEnvLocal(): Record<string, string> {
  const envPath = resolve(dirname(fileURLToPath(import.meta.url)), "../.env.local");
  const content = readFileSync(envPath, "utf8");
  const env: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    let value = trimmed.slice(eq + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }

  return env;
}

function isFastHostedImage(url: string | undefined): boolean {
  if (!url?.startsWith("http")) {
    return false;
  }
  return (
    url.includes("blob.vercel-storage.com") ||
    url.includes("foodrush-merchant.vercel.app/food/")
  );
}

function categoryFallbackUrl(categoryName: string): string {
  return `${MERCHANT_ORIGIN}${resolveFoodCategoryImagePath(categoryName)}`;
}

async function resolveItemImageUrl(item: {
  id: string;
  name: string;
  category: string;
  image?: string;
}): Promise<string> {
  if (isFastHostedImage(item.image)) {
    return item.image as string;
  }

  return categoryFallbackUrl(item.category);
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

  console.log(`Project: ${projectId} | Database: ${databaseId}`);
  console.log(`Category fallback host: ${MERCHANT_ORIGIN}`);
  console.log(`Category art files: ${Object.keys(getCategoryImagePathMap()).length}`);

  const snapshot = await getDocs(collection(db, INVENTORY_COLLECTION));
  const items = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...(docSnap.data() as { name: string; category: string; image?: string }),
  }));

  console.log(`Resolving images for ${items.length} items...`);

  let updated = 0;
  for (let i = 0; i < items.length; i += BATCH_LIMIT) {
    const chunk = items.slice(i, i + BATCH_LIMIT);
    const batch = writeBatch(db);

    for (const item of chunk) {
      const nextImage = await resolveItemImageUrl(item);
      if (nextImage !== item.image) {
        batch.update(
          doc(db, INVENTORY_COLLECTION, item.id),
          stripUndefinedForFirestore({ image: nextImage }),
        );
        updated += 1;
        console.log(`[${updated}] ${item.name}`);
      }
    }

    await batch.commit();
    console.log(`Committed batch ${Math.floor(i / BATCH_LIMIT) + 1}`);
  }

  console.log(`Done. Updated ${updated} of ${items.length} inventory images.`);
}

main().catch((error) => {
  console.error("Inventory image sync failed:", error);
  process.exit(1);
});
