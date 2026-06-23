import type { Order } from "@/types";
import {
  formatHistoryDate,
  formatHistoryTime,
  getBillTotal,
  getItemsSummary,
  getRejectionReason,
  getSimulatedRating,
} from "../../utils/orderHistoryUtils";
import { OrderHistoryRatingBadge } from "./OrderHistoryRatingBadge";
import { OrderHistoryStatusBadge } from "./OrderHistoryStatusBadge";

interface OrderHistoryListItemProps {
  order: Order;
  isSelected: boolean;
  onSelect: () => void;
}

export function OrderHistoryListItem({
  order,
  isSelected,
  onSelect,
}: OrderHistoryListItemProps): React.JSX.Element {
  const rating = getSimulatedRating(order.id);
  const billTotal = getBillTotal(order);
  const ts = order.status === "delivered" ? order.updatedAt : order.createdAt;

  return (
    <div className="px-4 pt-3">
      <button
        type="button"
        onClick={onSelect}
        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          isSelected
            ? "bg-[#EBF4FF] dark:bg-blue-950/30 border-blue-250 dark:border-blue-800"
            : "bg-white dark:bg-zinc-900 border-zinc-150 dark:border-zinc-800 hover:border-zinc-250 dark:hover:border-zinc-700"
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <OrderHistoryStatusBadge status={order.status} />
            {order.status === "delivered" && rating !== null && rating > 0 && (
              <OrderHistoryRatingBadge rating={rating} />
            )}
          </div>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 shrink-0 font-medium">
            {formatHistoryTime(ts)} | {formatHistoryDate(ts)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">ID: {order.id}</span>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-450 font-medium">
            By {order.customerName}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
            {getItemsSummary(order)}
          </p>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 shrink-0">
            ₹{billTotal.toFixed(2)}
          </span>
        </div>

        {order.status === "rejected" && (
          <p className="text-[11px] font-medium text-[#E23744] mt-2">{getRejectionReason(order)}</p>
        )}
      </button>
    </div>
  );
}
