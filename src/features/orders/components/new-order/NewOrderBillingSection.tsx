import type { OrderBilling } from "./types";

interface NewOrderBillingSectionProps {
  itemCount: number;
  billing: OrderBilling;
}

export function NewOrderBillingSection({
  itemCount,
  billing,
}: NewOrderBillingSectionProps): React.JSX.Element {
  const { itemTotal, taxes, discount, finalBill } = billing;

  return (
    <>
      <div className="px-4 py-2.5 space-y-1.5 bg-white dark:bg-zinc-900">
        <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span>
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
          <span>₹{itemTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span className="border-b border-dashed border-zinc-300 dark:border-zinc-700 cursor-help">
            Taxes
          </span>
          <span>₹{taxes.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span className="border-b border-dashed border-zinc-300 dark:border-zinc-700 cursor-help">
            Discount
          </span>
          <span>-₹{discount.toFixed(2)}</span>
        </div>
      </div>

      <div className="px-4 py-2.5 flex justify-between items-center bg-[#F9FAFB] dark:bg-zinc-900/50">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">Total Bill</span>
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
            PAID
          </span>
        </div>
        <span className="text-sm font-black text-zinc-900 dark:text-white">
          ₹{finalBill.toFixed(2)}
        </span>
      </div>
    </>
  );
}
