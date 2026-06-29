export type OrderStatus =
  | "placed"
  | "preparing"
  | "ready_for_pickup"
  | "dispatched"
  | "delivered"
  | "rejected";

export type DashboardTab = "orders" | "menu" | "history" | "complaints" | "reviews";

export type OrderTab = "preparing" | "ready" | "picked_up";

export type MerchantStatus = "Online" | "Offline";

export type ServiceType = "Delivery" | "Pickup";

export type ComplaintType = "Quality" | "Missing Item" | "Delivery Delay" | string;

export type HistoryStatus = Extract<OrderStatus, "delivered" | "rejected">;

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
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  deliveryCoords: [number, number]; // [lat, lng]
  riderCoords?: [number, number]; // [lat, lng]
  riderName?: string;
  riderPhone?: string;
  riderOtp?: number;
  riderAvatar?: string;
  prepTime?: number;
  prepStartedAt?: number;
}

export interface MenuItemVariant {
  id: string;
  name: string; // e.g., Size, Base, Crust
  options: {
    id: string;
    name: string; // e.g., Regular, Large
    price: number; // additional price
  }[];
}

export interface MenuItemAddon {
  id: string;
  name: string; // e.g., Extra Ghee, Cheese Dip
  price: number;
  inStock?: boolean;
  backInStockTime?: number;
}

export interface TempAddonGroup {
  id: string;
  name: string;
  options: MenuItemAddon[];
}

export interface MenuItem {
  id: string;
  name: string; // max 70 chars (Item Name)
  description?: string; // max 500 chars (Item Description)
  price: number; // base price
  foodType: "veg" | "non-veg" | "egg"; // Food Type selection pills
  serviceType: ServiceType | string; // Service Type (e.g., "Delivery")
  category: string; // Menu Category (e.g., "Punjabi Breakfast")
  subcategory?: string; // Subcategory (e.g., "Morning Favorites")
  inStock: boolean; // Availability state
  image: string; // Item Photos (URL, placeholder, or Emoji)
  packagingCharge?: number; // Packaging charges amount
  customisable?: boolean; // Customizable (has variants or addons)
  variants?: MenuItemVariant[]; // Item Type / Variants config
  addons?: MenuItemAddon[]; // Map Addons config
  backInStockTime?: number;
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
  type: ComplaintType;
  text: string;
  status: "pending" | "resolved";
  time: string;
  item: string;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string;
}

export type { ImageSearchResponse, ImageSearchResult } from "./api";
