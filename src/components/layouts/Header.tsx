import { Bell, ChevronDown, Moon, Settings, Sun, User, AlertCircle } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { tokens } from "@/lib/utils/tokens";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useOrders } from "@/features/orders/hooks/useOrders";

import { Toggle } from "@/components/ui/toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserProfile } from "@/types";

interface HeaderProps {
  userProfile: UserProfile;
  theme: "light" | "dark";
  toggleTheme: () => void;
  geoStatus: string;
  requestLocation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  theme,
  toggleTheme,
  geoStatus,
  requestLocation,
}) => {
  const { merchantStatus, setMerchantStatus, setSettingsOpen, setNotificationsOpen, notifications } = useDashboardStore();
  const [showOfflineConfirm, setShowOfflineConfirm] = useState(false);
  const [showOngoingOfflineWarning, setShowOngoingOfflineWarning] = useState(false);
  const [tick, setTick] = useState(0);

  const orders = useOrders();

  const ongoingOrders = useMemo(() => {
    return orders.filter(
      (o) => o.status === "placed" || o.status === "preparing" || o.status === "ready_for_pickup" || o.status === "dispatched"
    );
  }, [orders]);

  const hasOngoing = ongoingOrders.length > 0;

  // Tick timer to keep relative notification durations updated
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter out unread order notifications that have expired (timeLeft <= 0)
  const visibleNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (!item.orderId) return true;
      const order = orders.find((o) => o.id === item.orderId);
      if (!order) return true;
      if (order.status !== "placed") return true;
      const timeLeft = 300 - Math.floor((Date.now() - order.createdAt) / 1000);
      return timeLeft > 0;
    });
  }, [notifications, orders, tick]);

  const hasUnread = useMemo(() => visibleNotifications.some((n) => !n.read), [visibleNotifications]);

  // Check if any unread notification order has less than 60 seconds remaining
  const isUrgent = useMemo(() => {
    return visibleNotifications.some((n) => {
      if (n.read || !n.orderId) return false;
      const order = orders.find((o) => o.id === n.orderId);
      if (!order || order.status !== "placed") return false;
      const timeLeft = 300 - Math.floor((Date.now() - order.createdAt) / 1000);
      return timeLeft > 0 && timeLeft < 60;
    });
  }, [visibleNotifications, orders]);

  return (
    <header
      className={`flex h-16 items-center justify-between border-b ${tokens.colors.border} ${tokens.colors.headerBg} px-6 backdrop-blur-md relative z-50`}
    >
      {/* Brand Logo in Header */}
      <div className="flex flex-col select-none shrink-0">
        <span className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight leading-none">
          FoodRush
        </span>
        <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mt-0.5">
          — merchant console —
        </span>
      </div>

      <div className="flex items-center gap-4.5">
        {/* Real location helper button */}
        <button
          onClick={requestLocation}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-sm ${
            geoStatus === "granted"
              ? "border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-950 dark:bg-emerald-950/20 dark:text-emerald-400"
              : geoStatus === "requesting..."
                ? "border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-950 dark:bg-amber-950/20 dark:text-amber-400"
                : `border-zinc-200 bg-white ${tokens.colors.textSecondary} hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800`
          }`}
          title="Click to request your real location"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${geoStatus === "granted" ? "bg-emerald-400" : "bg-zinc-400"}`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${geoStatus === "granted" ? "bg-emerald-500" : "bg-zinc-500"}`}
            ></span>
          </span>
          <span>
            {geoStatus === "granted" && "Real Location Active"}
            {geoStatus === "requesting..." && "Locating..."}
            {geoStatus === "denied" && "Location Blocked"}
            {geoStatus === "timeout" && "Location Timeout"}
            {geoStatus === "unavailable" && "Location Unavailable"}
            {geoStatus === "using default" && "Use Real Location"}
            {geoStatus === "failed" && "Location Failed"}
          </span>
        </button>

        {/* Bell & Settings Icons (No vertical border line) */}
        <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
          <button
            onClick={() => setNotificationsOpen(true)}
            className="hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors relative"
            title="Open Notifications"
          >
            <Bell className={`h-4 w-4 ${isUrgent ? "animate-bounce text-red-600 dark:text-red-500" : ""}`} />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isUrgent ? "bg-red-400" : "bg-indigo-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isUrgent ? "bg-red-650" : "bg-indigo-650"}`}></span>
              </span>
            )}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer transition-colors"
            title="Open Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`flex items-center justify-center p-1.5 rounded-lg border ${tokens.colors.border} bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 ${tokens.colors.textMuted} transition-colors shadow-sm cursor-pointer`}
          aria-label="Toggle theme"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <Moon className="h-3.5 w-3.5" />
          ) : (
            <Sun className="h-3.5 w-3.5 text-amber-500" />
          )}
        </button>

        {/* Online/Offline status Toggle switch */}
        <Toggle
          pressed={merchantStatus === "Online"}
          onPressedChange={(pressed) => {
            if (pressed) {
              setMerchantStatus("Online");
            } else {
              if (hasOngoing) {
                setShowOngoingOfflineWarning(true);
              } else {
                setShowOfflineConfirm(true);
              }
            }
          }}
          className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer select-none ${
            merchantStatus === "Online"
              ? "border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
              : "border-rose-250 bg-rose-50 text-rose-700 hover:bg-rose-100/50 dark:border-rose-900 dark:bg-rose-950/25 dark:text-rose-400 dark:hover:bg-rose-950/40"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full transition-colors ${
              merchantStatus === "Online" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          />
          <span>{merchantStatus}</span>
        </Toggle>

        <AlertDialog open={showOfflineConfirm} onOpenChange={setShowOfflineConfirm}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Go Offline?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to go offline? You will stop receiving new order notifications on this device.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setMerchantStatus("Offline");
                  setShowOfflineConfirm(false);
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white"
              >
                Go Offline
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showOngoingOfflineWarning} onOpenChange={setShowOngoingOfflineWarning}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <span className="text-zinc-950 dark:text-white font-extrabold text-base">Blocked</span>
              </AlertDialogTitle>
              <div className="pt-2">
                <Alert variant="destructive" className="bg-red-50/50 border-red-200 text-red-850 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300">
                  <AlertCircle className="h-4 w-4 text-red-650 dark:text-red-500" />
                  <AlertTitle className="font-extrabold text-xs">Active Orders Ongoing</AlertTitle>
                  <AlertDescription className="text-[11px] leading-relaxed font-bold">
                    You cannot go offline while there are active orders. Please complete or reject them first.
                  </AlertDescription>
                </Alert>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogAction
                onClick={() => setShowOngoingOfflineWarning(false)}
                className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs cursor-pointer"
              >
                Okay
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Profile Avatar Pill */}
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/40 px-1.5 py-1 shadow-sm">
          <div className="flex h-6 w-6 overflow-hidden items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
            {userProfile.avatarUrl ? (
              // biome-ignore lint/performance/noImgElement: Avatar image source can be external
              <img
                src={userProfile.avatarUrl}
                alt={userProfile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-3.5 w-3.5" />
            )}
          </div>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[100px]">
            {userProfile.name}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
