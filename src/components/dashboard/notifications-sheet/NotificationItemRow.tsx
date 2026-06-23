"use client";

import { AlertCircle, CheckCheck } from "lucide-react";
import { getOrderTimeLeft } from "@/hooks/useVisibleNotifications";
import type { NotificationItem } from "@/stores/useDashboardStore";
import type { Order } from "@/types";
import { formatNotificationSeconds, NotificationTypeIcon } from "./notificationUtils";

interface NotificationItemRowProps {
  item: NotificationItem;
  orders: Order[];
  now: number;
  onOrderAction: (orderId: string) => void;
  onMarkRead: (id: string) => void;
}

export function NotificationItemRow({
  item,
  orders,
  now,
  onOrderAction,
  onMarkRead,
}: NotificationItemRowProps): React.JSX.Element {
  const isOrderAction = !!item.orderId;
  const matchingOrder = isOrderAction ? orders.find((o) => o.id === item.orderId) : null;
  const isPlaced = matchingOrder?.status === "placed";
  const orderTimeLeft = matchingOrder ? getOrderTimeLeft(matchingOrder.createdAt, now) : 0;
  const isTimeCritical = isPlaced && orderTimeLeft > 0 && orderTimeLeft < 60;

  return (
    <div
      onClick={() => {
        if (isOrderAction && item.orderId && isPlaced) {
          onOrderAction(item.orderId);
        } else {
          onMarkRead(item.id);
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
          <NotificationTypeIcon type={item.type} />
        )}
      </div>
      <div className="space-y-1 min-w-0 flex-1">
        <div className="flex justify-between items-start gap-4">
          <span
            className={`text-xs font-bold leading-none ${isTimeCritical ? "text-red-700 dark:text-red-400" : item.read ? "text-zinc-800 dark:text-zinc-200" : "text-zinc-950 dark:text-white"}`}
          >
            {item.title}
          </span>
          <span className="text-[9px] font-semibold text-zinc-450 dark:text-zinc-500 whitespace-nowrap">
            {item.time}
          </span>
        </div>
        <p
          className={`text-[10px] leading-relaxed ${isTimeCritical ? "text-red-600 dark:text-red-400 font-medium" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          {item.description}
        </p>
        {isOrderAction && !isPlaced && <OrderStatusBadge status={matchingOrder?.status} />}
        {isOrderAction && isPlaced && (
          <OrderActionBadge isTimeCritical={isTimeCritical} orderTimeLeft={orderTimeLeft} />
        )}
      </div>
    </div>
  );
}

interface OrderStatusBadgeProps {
  status?: Order["status"];
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps): React.JSX.Element {
  if (status === "rejected") {
    return (
      <span className="inline-block mt-1.5 text-[8px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/15 border border-red-200 dark:border-red-900/30 px-1.5 py-0.5 rounded-sm">
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-block mt-1.5 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/15 border border-emerald-250 dark:border-emerald-900/30 px-1.5 py-0.5 rounded-sm">
      Accepted
    </span>
  );
}

interface OrderActionBadgeProps {
  isTimeCritical: boolean;
  orderTimeLeft: number;
}

function OrderActionBadge({
  isTimeCritical,
  orderTimeLeft,
}: OrderActionBadgeProps): React.JSX.Element {
  if (isTimeCritical) {
    return (
      <span className="inline-flex items-center gap-1 mt-1.5 text-[8px] font-black text-white uppercase tracking-wider bg-red-600 px-2 py-0.5 rounded-sm animate-bounce">
        Losing Order ({formatNotificationSeconds(orderTimeLeft)})
      </span>
    );
  }
  return (
    <span className="inline-block mt-1.5 text-[8px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-50 dark:bg-red-950/15 border border-red-200 dark:border-red-900/30 px-1.5 py-0.5 rounded-sm animate-pulse">
      Action Required
    </span>
  );
}
