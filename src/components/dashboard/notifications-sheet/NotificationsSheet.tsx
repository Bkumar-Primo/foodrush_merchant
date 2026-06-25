"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useVisibleNotifications } from "@/hooks/useVisibleNotifications";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { NotificationItemRow } from "./NotificationItemRow";
import { NotificationsEmptyState } from "./NotificationsEmptyState";
import { NotificationsSheetHeader } from "./NotificationsSheetHeader";

export function NotificationsSheet(): React.JSX.Element {
  const {
    notificationsOpen,
    setNotificationsOpen,
    markAllAsRead,
    markAsRead,
    setActiveModalOrderId,
    removeMinimizedOrderId,
  } = useDashboardStore();

  const { visibleNotifications, orders, now } = useVisibleNotifications();

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;
  const hasUnreadNonOrder = visibleNotifications.some((n) => !n.read && !n.orderId);

  const handleOrderAction = (orderId: string) => {
    removeMinimizedOrderId(orderId);
    setActiveModalOrderId(orderId);
    setNotificationsOpen(false);
  };

  return (
    <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex flex-col p-0 h-full overflow-hidden bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
      >
        <NotificationsSheetHeader unreadCount={unreadCount} />

        {visibleNotifications.length > 0 && (
          <div className="px-6 py-2 bg-zinc-50/50 dark:bg-zinc-900/30 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center shrink-0">
            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Recent Alerts
            </span>
            {hasUnreadNonOrder && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-medium text-primary hover:text-[#B8433A] dark:text-[#F4A99A] dark:hover:text-primary transition-colors cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {visibleNotifications.length === 0 ? (
            <NotificationsEmptyState />
          ) : (
            visibleNotifications.map((item) => (
              <NotificationItemRow
                key={item.id}
                item={item}
                orders={orders}
                now={now}
                onOrderAction={handleOrderAction}
                onMarkRead={markAsRead}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationsSheet;
