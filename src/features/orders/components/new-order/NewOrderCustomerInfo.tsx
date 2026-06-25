import type { Order } from "@/types";
import { formatOrderTime } from "./orderBillingUtils";

interface NewOrderCustomerInfoProps {
  order: Order;
}

export function NewOrderCustomerInfo({
  order,
}: NewOrderCustomerInfoProps): React.JSX.Element {
  return (
    <div className="px-4 py-2.5 flex items-start justify-between bg-white dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-850">
      <div className="space-y-0.5">
        <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
          ID. {order.id.slice(-4)} | {formatOrderTime(order.createdAt)}
        </span>
      </div>
      <div className="text-right">
        <span className="text-[10.5px] text-zinc-550 dark:text-zinc-400 font-medium block">
          Order by {order.customerName}
        </span>
      </div>
    </div>
  );
}
