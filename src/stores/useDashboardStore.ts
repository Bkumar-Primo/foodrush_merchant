import { create } from "zustand";
import type { DashboardTab, MerchantStatus, UserProfile } from "@/types";

export type RingtoneOption = "signature" | "siren";

export function isRingtoneOption(value: string): value is RingtoneOption {
  return value === "signature" || value === "siren";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  orderId?: string;
}

export interface DashboardState {
  activeTab: DashboardTab;
  selectedOrderId: string | null;
  soundEnabled: boolean;
  selectedRingtone: RingtoneOption;
  volume: number;
  theme: "light" | "dark";
  userProfile: UserProfile;
  merchantStatus: MerchantStatus;
  settingsOpen: boolean;
  notificationsOpen: boolean;
  notifications: NotificationItem[];
  activeModalOrderId: string | null;
  minimizedOrderIds: string[];
  setActiveTab: (tab: DashboardTab) => void;
  setSelectedOrderId: (id: string | null) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSelectedRingtone: (ringtone: RingtoneOption) => void;
  setVolume: (volume: number) => void;
  setTheme: (theme: "light" | "dark") => void;
  setUserProfile: (profile: UserProfile) => void;
  setMerchantStatus: (status: MerchantStatus) => void;
  setSettingsOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  setNotifications: (notifications: NotificationItem[]) => void;
  addNotification: (notification: Omit<NotificationItem, "id" | "time" | "read">) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  setActiveModalOrderId: (id: string | null) => void;
  addMinimizedOrderId: (id: string) => void;
  removeMinimizedOrderId: (id: string) => void;
  resolveOrderNotification: (orderId: string) => void;
  clearAll: () => void;
}

export const RINGTONE_MAP: Record<RingtoneOption, { label: string; file: string }> = {
  signature: { label: "Signature Sound", file: "/sounds/Signature sound.mp3" },
  siren: { label: "Siren", file: "/sounds/Siren.mp3" },
};

export const useDashboardStore = create<DashboardState>((set) => ({
  activeTab: "orders",
  selectedOrderId: null,
  soundEnabled: true,
  selectedRingtone: "signature",
  volume: 80,
  theme: "light",
  userProfile: { name: "Bittu Kumar" },
  merchantStatus: "Online",
  settingsOpen: false,
  notificationsOpen: false,
  notifications: [],
  activeModalOrderId: null,
  minimizedOrderIds: [],
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedOrderId: (selectedOrderId) => set({ selectedOrderId }),
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setSelectedRingtone: (selectedRingtone) => set({ selectedRingtone }),
  setVolume: (volume) => set({ volume }),
  setTheme: (theme) => set({ theme }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setMerchantStatus: (merchantStatus) => set({ merchantStatus }),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),
  setNotifications: (notifications) => set({ notifications }),
  addNotification: (notification) =>
    set((state) => {
      // Prevent duplicates for the same orderId
      if (
        notification.orderId &&
        state.notifications.some((n) => n.orderId === notification.orderId)
      ) {
        return {};
      }
      const newNotification: NotificationItem = {
        ...notification,
        id: Math.random().toString(),
        time: "Just now",
        read: false,
      };
      return { notifications: [newNotification, ...state.notifications] };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.orderId ? n : { ...n, read: true })),
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id && !n.orderId ? { ...n, read: true } : n,
      ),
    })),
  setActiveModalOrderId: (activeModalOrderId) => set({ activeModalOrderId }),
  addMinimizedOrderId: (id) =>
    set((state) => {
      if (state.minimizedOrderIds.includes(id)) return {};
      return { minimizedOrderIds: [...state.minimizedOrderIds, id] };
    }),
  removeMinimizedOrderId: (id) =>
    set((state) => ({
      minimizedOrderIds: state.minimizedOrderIds.filter((mid) => mid !== id),
    })),
  resolveOrderNotification: (orderId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.orderId === orderId ? { ...n, read: true } : n,
      ),
    })),
  clearAll: () =>
    set({
      notifications: [],
      minimizedOrderIds: [],
      activeModalOrderId: null,
      selectedOrderId: null,
    }),
}));

if (typeof window !== "undefined") {
  window.dashboardStore = useDashboardStore;
}
