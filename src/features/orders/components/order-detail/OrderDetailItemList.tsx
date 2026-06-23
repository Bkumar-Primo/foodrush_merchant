import { Drumstick, LeafyGreen, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { Order } from "@/types";
import { isItemVeg, type OrderDietType } from "./orderDetailUtils";

interface OrderDetailItemListProps {
  order: Order;
  orderDietType: OrderDietType;
  finalBill: number;
}

function dietBadge(dietType: OrderDietType): React.JSX.Element | null {
  if (dietType === "veg") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5">
        <LeafyGreen className="h-4 w-4 text-green-600" />
        <span className="text-[12px] font-medium text-green-600 uppercase tracking-wider">
          VEG ONLY ORDER
        </span>
      </div>
    );
  }
  if (dietType === "non-veg") {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5">
        <Drumstick className="h-4 w-4 text-red-600" />
        <span className="text-[12px] font-medium text-red-600 uppercase tracking-wider">
          NON-VEG ONLY ORDER
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-0.5">
      <span className="text-[12px] font-medium text-amber-600 uppercase tracking-wider">
        VEG/NON-VEG ORDER
      </span>
    </div>
  );
}

export function OrderDetailItemList({
  order,
  orderDietType,
  finalBill,
}: OrderDetailItemListProps): React.JSX.Element {
  return (
    <>
      <div className="flex items-start mx-3 my-1">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#FFF2F2] dark:bg-rose-950/20 border border-[#FFE0E0] dark:border-rose-900/30 text-[10px] font-bold text-[#E8604C] dark:text-rose-400 leading-none">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
            <Utensils className="h-3 w-3" />
          </span>
          Don&apos;t send cutlery, tissues and straws
        </span>
      </div>

      <div className="p-4 flex-1">
        <div className="space-y-2.5 mb-4">
          {order.items.map((item) => {
            const veg = isItemVeg(item);
            return (
              <div key={item.id} className="flex items-start justify-between text-xs">
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "mt-0.5 border rounded p-px inline-flex items-center justify-center size-3.5 shrink-0",
                      veg ? "border-green-600" : "border-red-600",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        veg ? "bg-green-600" : "bg-red-600",
                      )}
                    />
                  </div>
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {item.quantity} x{" "}
                    <span className="underline decoration-dotted underline-offset-4">
                      {item.name}
                    </span>
                  </span>
                </div>
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>

        <div
          className={cn(
            "flex items-center justify-between pt-3 border-t border-b pb-3",
            tokens.colors.borderMuted,
          )}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                tokens.fontSizes.body,
                tokens.colors.textPrimary,
                "underline decoration-dotted underline-offset-4",
              )}
            >
              Total Bill
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider">
              PAID
            </span>
          </div>
          <span className="text-sm font-medium text-zinc-950 dark:text-white">
            ₹{finalBill.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-center mt-1 pt-1">{dietBadge(orderDietType)}</div>
      </div>
    </>
  );
}
