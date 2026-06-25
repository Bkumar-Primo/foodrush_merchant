import { Printer } from "lucide-react";
import type { Order } from "@/types";
import { getBillTotal } from "../../utils/orderHistoryUtils";

interface OrderHistoryDetailItemsProps {
  order: Order;
}

export function OrderHistoryDetailItems({
  order,
}: OrderHistoryDetailItemsProps): React.JSX.Element {
  const billTotal = getBillTotal(order);
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
          Order Details
        </h4>
        <button
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 border border-primary rounded text-primary text-[10px] font-medium hover:bg-[#D4543C]/10 dark:hover:bg-[#D4543C]/15 cursor-pointer"
        >
          <Printer className="h-3 w-3" /> Print Order
        </button>
      </div>

      <div className="space-y-3">
        {order.items.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-start justify-between text-xs">
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {item.quantity} x {item.name}
              </span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                ₹{item.price * item.quantity}
              </span>
            </div>
            {item.name.toLowerCase().includes("litti") && (
              <p className="text-[11px] text-primary mt-0.5">
                Choose Your Beverage: Thums Up Soft Beverage [250 ml]
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span>{itemCount} items</span>
          <span>₹{billTotal}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <span>Taxes</span>
          <span>₹0</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-white">Total Bill</span>
            {order.status === "delivered" && (
              <span className="px-1.5 py-0.5 rounded border border-emerald-500 text-emerald-600 text-[9px] font-medium uppercase">
                Paid
              </span>
            )}
          </div>
          <span className="text-sm font-medium text-zinc-900 dark:text-white">₹{billTotal}</span>
        </div>
      </div>
    </div>
  );
}
