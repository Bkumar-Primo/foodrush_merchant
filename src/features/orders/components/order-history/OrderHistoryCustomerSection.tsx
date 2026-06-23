import Image from "next/image";
import type { Order } from "@/types";
import {
  formatHistoryTime,
  getCustomerLocality,
  getCustomerOrderCount,
  getSimulatedRider,
} from "../../utils/orderHistoryUtils";

interface OrderHistoryDeliveryStatusProps {
  order: Order;
}

export function OrderHistoryDeliveryStatus({
  order,
}: OrderHistoryDeliveryStatusProps): React.JSX.Element {
  const rider = getSimulatedRider(order.id);

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-zinc-200 shrink-0">
        <Image src={rider.avatar} alt={rider.name} fill className="object-cover" />
      </div>
      <p className="text-xs text-zinc-600 dark:text-zinc-400">
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{rider.name}</span>{" "}
        delivered the order at {formatHistoryTime(order.updatedAt)}
      </p>
    </div>
  );
}

interface OrderHistoryCustomerDetailsProps {
  order: Order;
}

export function OrderHistoryCustomerDetails({
  order,
}: OrderHistoryCustomerDetailsProps): React.JSX.Element {
  return (
    <div>
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">
        Customer Details
      </h4>
      <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
        <p>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Name:</span>{" "}
          {order.customerName}
        </p>
        <p>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Orders placed till date:
          </span>{" "}
          {getCustomerOrderCount(order)}
        </p>
        <p>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">Locality:</span>{" "}
          {getCustomerLocality(order)}
        </p>
      </div>
    </div>
  );
}
