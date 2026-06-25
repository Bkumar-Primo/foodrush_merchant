/** Firestore collection paths — shared across Customer, Merchant, Rider, and Admin apps. */
export const FIRESTORE_COLLECTIONS = {
  orders: "orders",
  inventory: "inventory",
  merchants: "merchants",
  orderEvents: "order_events",
} as const;

export const FIREBASE_ENV_KEYS = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  databaseId: "NEXT_PUBLIC_FIREBASE_DATABASE_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
} as const;

/** Firestore database ID — must match the database selected in Firebase Console. */
export const DEFAULT_FIRESTORE_DATABASE_ID = "(default)";
