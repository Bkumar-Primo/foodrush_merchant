"use client";

import React from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { XIcon, Bell, CircleCheck, Info, AlertTriangle, AlertCircle, CheckCheck } from "lucide-react";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useOrders } from "@/features/orders/hooks/useOrders";

export const NotificationsSheet: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    setNotifications,
    markAllAsRead,
    markAsRead,
    setActiveModalOrderId,
    removeMinimizedOrderId,
  } = useDashboardStore();

  const orders = useOrders();
  const [tick, setTick] = React.useState(0);

  // Tick timer to keep relative notification durations updated
  React.useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter out unread order notifications that have expired (timeLeft <= 0)
  const visibleNotifications = React.useMemo(() => {
    return notifications.filter((item) => {
      if (!item.orderId) return true;
      const order = orders.find((o) => o.id === item.orderId);
      if (!order) return true;
      if (order.status !== "placed") return true;
      const timeLeft = 300 - Math.floor((Date.now() - order.createdAt) / 1000);
      return timeLeft > 0;
    });
  }, [notifications, orders, tick]);

  // Clean up expired notifications from store
  React.useEffect(() => {
    const expiredIds = notifications
      .filter((item) => {
        if (!item.orderId) return false;
        const order = orders.find((o) => o.id === item.orderId);
        if (!order || order.status !== "placed") return false;
        const timeLeft = 300 - Math.floor((Date.now() - order.createdAt) / 1000);
        return timeLeft <= 0;
      })
      .map((n) => n.id);

    if (expiredIds.length > 0) {
      setNotifications(notifications.filter((n) => !expiredIds.includes(n.id)));
    }
  }, [notifications, orders, tick, setNotifications]);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const getIcon = (type: "success" | "info" | "warning" | "error") => {
    switch (type) {
      case "success":
        return <CircleCheck className="h-4 w-4 text-emerald-500 shrink-0" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500 shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />;
    }
  };

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;
  const hasUnreadNonOrder = visibleNotifications.some((n) => !n.read && !n.orderId);

  const formatSeconds = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex flex-col p-0 h-full overflow-hidden bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
      >
        {/* Fixed Header */}
        <SheetHeader className="px-6 py-1 border-b border-zinc-100 dark:border-zinc-900 shrink-0 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              Notifications
            </SheetTitle>
            {unreadCount > 0 && (
              <span className="rounded-full bg-indigo-650 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer h-8 w-8 p-0"
              size="icon-sm"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Action Bar */}
        {visibleNotifications.length > 0 && (
          <div className="px-6 py-2 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Recent Alerts
            </span>
            {hasUnreadNonOrder && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {visibleNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
              <Bell className="h-8 w-8 text-zinc-350 dark:text-zinc-650" />
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">All caught up!</p>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-500">No new notifications at this time.</p>
            </div>
          ) : (
            visibleNotifications.map((item) => {
              const isOrderAction = !!item.orderId;
              const matchingOrder = isOrderAction ? orders.find(o => o.id === item.orderId) : null;
              const isPlaced = matchingOrder?.status === "placed";
              
              const orderTimeLeft = matchingOrder ? 300 - Math.floor((Date.now() - matchingOrder.createdAt) / 1000) : 0;
              const isTimeCritical = isPlaced && orderTimeLeft > 0 && orderTimeLeft < 60;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isOrderAction && item.orderId && isPlaced) {
                      // Remove from minimized list and trigger popup
                      removeMinimizedOrderId(item.orderId);
                      setActiveModalOrderId(item.orderId);
                      setNotificationsOpen(false);
                    } else {
                      markAsRead(item.id);
                    }
                  }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all relative ${
                    isOrderAction && isPlaced
                      ? "cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/5 dark:hover:border-indigo-800 dark:hover:bg-indigo-950/5"
                      : ""
                  } ${
                    isTimeCritical
                      ? "bg-red-50/70 border-red-500/80 dark:bg-red-950/20 dark:border-red-800/80 animate-pulse border-2 shadow-xs"
                      : item.read
                        ? "bg-white border-zinc-100 dark:bg-zinc-950 dark:border-zinc-900"
                        : "bg-indigo-50/10 border-indigo-100/50 dark:bg-indigo-950/5 dark:border-indigo-900/20"
                  }`}
                >
                  {!item.read && (
                    <span className="absolute top-3.5 left-2 flex h-1.5 w-1.5 rounded-full bg-indigo-650" />
                  )}
                  <div className="pt-0.5 pl-1.5">
                    {isTimeCritical ? (
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500 shrink-0" />
                    ) : !isOrderAction && item.read ? (
                      <CheckCheck className="h-4 w-4 text-blue-500 dark:text-blue-400 shrink-0" />
                    ) : (
                      getIcon(item.type)
                    )}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex justify-between items-start gap-4">
                      <span className={`text-xs font-bold leading-none ${isTimeCritical ? "text-red-700 dark:text-red-400" : item.read ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-950 dark:text-white"}`}>
                        {item.title}
                      </span>
                      <span className="text-[9px] font-semibold text-zinc-450 dark:text-zinc-500 whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                    <p className={`text-[10px] leading-relaxed ${isTimeCritical ? "text-red-600 dark:text-red-400 font-medium" : "text-zinc-500 dark:text-zinc-400"}`}>
                      {item.description}
                    </p>
                    {isOrderAction && !isPlaced && (
                      matchingOrder?.status === "rejected" ? (
                        <span className="inline-block mt-1.5 text-[8px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/15 border border-red-200 dark:border-red-900/30 px-1.5 py-0.5 rounded-sm">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-block mt-1.5 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-250 dark:border-emerald-900/30 px-1.5 py-0.5 rounded-sm">
                          Accepted
                        </span>
                      )
                    )}
                    {isOrderAction && isPlaced && (
                      isTimeCritical ? (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[8px] font-black text-white uppercase tracking-wider bg-red-600 px-2 py-0.5 rounded-sm animate-bounce">
                          Losing Order ({formatSeconds(orderTimeLeft)})
                        </span>
                      ) : (
                        <span className="inline-block mt-1.5 text-[8px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/15 border border-red-200 dark:border-red-900/30 px-1.5 py-0.5 rounded-sm animate-pulse">
                          Action Required
                        </span>
                      )
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsSheet;
