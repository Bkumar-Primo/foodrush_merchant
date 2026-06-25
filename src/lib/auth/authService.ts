import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/db/firebaseClient";

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error("Firebase Auth is not configured. Check NEXT_PUBLIC_FIREBASE_* in .env.local.");
  }
  return auth;
}

export async function signInWithEmail(
  email: string,
  password: string,
  rememberMe: boolean,
): Promise<User> {
  const auth = requireAuth();
  await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const auth = requireAuth();
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOutUser(): Promise<void> {
  const auth = requireAuth();
  await signOut(auth);
}

export async function updateAuthDisplayName(displayName: string): Promise<User> {
  const auth = requireAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not signed in.");
  }
  const trimmed = displayName.trim();
  if (!trimmed) {
    throw new Error("Display name cannot be empty.");
  }
  await updateProfile(user, { displayName: trimmed });
  return user;
}

export async function sendPasswordReset(email: string): Promise<void> {
  const auth = requireAuth();
  await sendPasswordResetEmail(auth, email);
}

export async function signInWithGoogle(): Promise<User> {
  const auth = requireAuth();
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

export async function signInWithApple(): Promise<User> {
  const auth = requireAuth();
  const provider = new OAuthProvider("apple.com");
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return auth.onAuthStateChanged(callback);
}

export function getAuthDisplayName(user: User | null): string {
  if (!user) {
    return "Merchant";
  }
  return user.displayName || user.email?.split("@")[0] || "Merchant";
}
