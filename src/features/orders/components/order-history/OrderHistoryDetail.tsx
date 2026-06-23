import type { Order } from "@/types";
import {
  formatHistoryDate,
  formatHistoryTime,
  getCustomerOrderCount,
  getSimulatedRating,
} from "../../utils/orderHistoryUtils";
import {
  OrderHistoryCustomerDetails,
  OrderHistoryDeliveryStatus,
} from "./OrderHistoryCustomerSection";
import { OrderHistoryDetailItems } from "./OrderHistoryDetailItems";
import { OrderHistoryRatingBadge } from "./OrderHistoryRatingBadge";
import { OrderHistoryStatusBadge } from "./OrderHistoryStatusBadge";
import { OrderHistoryTimeline } from "./OrderHistoryTimeline";

interface OrderHistoryDetailProps {
  order: Order;
}

export function OrderHistoryDetail({ order }: OrderHistoryDetailProps): React.JSX.Element {
  const rating = getSimulatedRating(order.id);
  const ts = order.status === "delivered" ? order.updatedAt : order.createdAt;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
        <span className="text-sm font-bold text-zinc-900 dark:text-white">ID: {order.id}</span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-500">
            {formatHistoryTime(ts)} | {formatHistoryDate(ts)}
          </span>
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1 border border-blue-500 rounded text-blue-600 text-[11px] font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/20 cursor-pointer"
          >
            Help
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <OrderHistoryStatusBadge status={order.status} />
            <span className="text-xs text-zinc-650 dark:text-zinc-400 font-semibold">
              {getCustomerOrderCount(order)} orders by {order.customerName}
            </span>
          </div>
          {order.status === "delivered" && rating !== null && rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-zinc-500">Customer rating</span>
              <OrderHistoryRatingBadge rating={rating} />
            </div>
          )}
        </div>

        {order.status === "delivered" && <OrderHistoryTimeline order={order} />}
        <OrderHistoryDetailItems order={order} />

        {order.status === "delivered" && <OrderHistoryDeliveryStatus order={order} />}
        <OrderHistoryCustomerDetails order={order} />
      </div>
    </div>
  );
}
