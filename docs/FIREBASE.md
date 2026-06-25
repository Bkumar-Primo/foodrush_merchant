# Firebase setup — DelivRN portfolio apps

The merchant app uses **Cloud Firestore** for all orders and menu data. Configure `NEXT_PUBLIC_FIREBASE_*` in `.env.local` before running the app.

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project (e.g. `delivrn-portfolio`)
3. Enable **Firestore Database** (start in **test mode** for the pitch, then deploy rules below)

## 2. Register the Merchant web app

1. Project settings → **Add app** → Web
2. Copy the `firebaseConfig` values into `.env.local` (see `.env.example`)

```bash
cp .env.example .env.local
# Fill in all NEXT_PUBLIC_FIREBASE_* values
```

3. Restart the dev server: `npm run dev`

## 2b. Enable Firebase Authentication

1. Firebase Console → **Authentication** → **Get started**
2. Enable **Email/Password** sign-in method
3. Enable **Google** (add support email, save)
4. Optional: enable **Apple** for Sign in with Apple
5. **Authentication** → **Settings** → **Authorized domains** — ensure `localhost` is listed

Create a merchant account via **Sign up** at `/signup`, or add a user in **Authentication** → **Users**.

## 3. Deploy Firestore rules & indexes

Install Firebase CLI if needed: `npm install -g firebase-tools`

```bash
firebase login
firebase init firestore   # select existing project, use firestore.rules + firestore.indexes.json
firebase deploy --only firestore
```

> Rules in `firestore.rules` are **open for development**. Lock them down before any public launch.

## 4. Shared Firestore schema (all apps)

### `orders` collection

Document ID = `order.id` (important for cross-app updates).

```ts
{
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: { id, name, price, quantity }[];
  totalAmount: number;
  status: "placed" | "preparing" | "ready_for_pickup" | "dispatched" | "delivered" | "rejected";
  createdAt: number;      // ms timestamp
  updatedAt: number;
  deliveryCoords: [lat, lng];
  riderCoords?: [lat, lng];
  prepTime?: number;
  prepStartedAt?: number;
}
```

**Order flow (live simulator / production):**

```
placed → preparing → ready_for_pickup → dispatched → delivered
                  ↘ rejected
```

| App | Typical actions |
|-----|-----------------|
| Customer | Creates order (`placed`) |
| Merchant | Accept (`preparing`), mark ready (`ready_for_pickup`), reject |
| Rider | Pick up (`dispatched`), deliver (`delivered`), update `riderCoords` |
| Admin | Read-only listeners + metrics |

### `inventory` collection

Document ID = `item.id`. Menu items for the merchant menu editor.

On first connect, the merchant app **auto-seeds** demo inventory if the collection is empty.

### `order_events` (optional)

Append-only log for admin dashboard live feed:

```ts
{ orderId, type, message, createdAt }
```

## 5. Connect other apps

Use the **same** `firebaseConfig` / project ID in:

- Customer app (React Native)
- Rider app (React Native)
- Admin web (React / Next)
- Portfolio pitch simulator (`/Users/bittu/Desktop/Bittu/doc`)

Subscribe to `orders` with `onSnapshot` and mutate using the **document ID = order.id** convention.

### Example (any app)

```ts
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// Listen to all orders
onSnapshot(collection(db, "orders"), (snap) => {
  const orders = snap.docs.map((d) => d.data());
});

// Customer places order
await setDoc(doc(db, "orders", orderId), { ...order, status: "placed" });

// Merchant accepts
await updateDoc(doc(db, "orders", orderId), {
  status: "preparing",
  prepTime: 40,
  prepStartedAt: Date.now(),
  updatedAt: Date.now(),
});
```

## 6. Verify connection

Open **Settings** in the merchant dashboard — the Firebase panel shows **Connected to Firestore** with your project ID.

## 7. Import paths in this repo

```ts
import {
  subscribeToOrders,
  updateOrderStatus,
  getFirebaseProjectId,
  FIRESTORE_COLLECTIONS,
} from "@/lib/db";
```
