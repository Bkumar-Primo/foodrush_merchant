import type { Order } from "@/types";
import { formatOrderTime } from "./orderBillingUtils";

interface NewOrderCustomerInfoProps {
  order: Order;
  isSimulatedLitti: boolean;
}

export function NewOrderCustomerInfo({
  order,
  isSimulatedLitti,
}: NewOrderCustomerInfoProps): React.JSX.Element {
  return (
    <div className="px-4 py-2.5 flex items-start justify-between bg-white dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-850">
      <div className="space-y-0.5">
        <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
          ID. {isSimulatedLitti ? "3127" : order.id.slice(-4)} |{" "}
          {isSimulatedLitti ? "7:09 PM" : formatOrderTime(order.createdAt)}
        </span>
      </div>
      <div className="text-right">
        <span className="text-[10.5px] text-zinc-550 dark:text-zinc-400 font-bold block">
          16th order by {isSimulatedLitti ? "Khalil Ravi" : order.customerName}
        </span>
        <span className="inline-block mt-0.5 bg-[#FFF9F0] border border-[#FFE2B3] text-[#A66E2E] dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
          PREMIUM
        </span>
      </div>
    </div>
  );
}
