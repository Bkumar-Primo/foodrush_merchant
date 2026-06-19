export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: "placed" | "preparing" | "ready_for_pickup" | "dispatched" | "delivered" | "rejected";
  createdAt: number;
  updatedAt: number;
  deliveryCoords: [number, number]; // [lat, lng]
  riderCoords?: [number, number]; // [lat, lng]
  prepTime?: number;
  prepStartedAt?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  image: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  orderedItems: string[];
  reply?: string;
}

export interface Complaint {
  id: string;
  orderId: string;
  customerName: string;
  type: string;
  text: string;
  status: "pending" | "resolved";
  time: string;
  item: string;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
}
