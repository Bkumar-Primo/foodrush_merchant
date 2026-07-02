import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import { type FirebaseStorage, getStorage } from "firebase/storage";
import { DEFAULT_FIRESTORE_DATABASE_ID } from "./collections";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let initAttempted = false;

function isFirebaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim());
}

function initializeFirebase(): FirebaseApp | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!isFirebaseConfigured()) {
    return null;
  }
  if (initAttempted) {
    return app;
  }
  initAttempted = true;

  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app, getFirebaseDatabaseId());
    auth = getAuth(app);
    storage = getStorage(app);
    return app;
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    app = null;
    auth = null;
    db = null;
    storage = null;
    return null;
  }
}

export function getFirebaseApp(): FirebaseApp | null {
  return initializeFirebase();
}

export function getFirestoreDb(): Firestore | null {
  initializeFirebase();
  return db;
}

export function getFirebaseAuth(): Auth | null {
  initializeFirebase();
  return auth;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  initializeFirebase();
  return storage;
}

export function getFirebaseProjectId(): string | null {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? null;
}

export function getFirebaseDatabaseId(): string {
  return process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID?.trim() || DEFAULT_FIRESTORE_DATABASE_ID;
}

export function isFirebaseConfiguredOnClient(): boolean {
  return typeof window !== "undefined" && isFirebaseConfigured();
}
