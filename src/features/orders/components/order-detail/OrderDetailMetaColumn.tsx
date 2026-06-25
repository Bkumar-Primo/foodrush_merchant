import { Clock, PhoneOutgoing, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { Order } from "@/types";

interface OrderDetailMetaColumnProps {
  order: Order;
  placedTimeDisplay: string;
}

function PrintButton({ label }: { label: string }): React.JSX.Element {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors",
        tokens.colors.orderActionBorder,
        tokens.colors.orderActionText,
        tokens.colors.orderActionOutlineHover,
      )}
    >
      <Printer className="h-3 w-3" /> {label}
    </button>
  );
}

export function OrderDetailMetaColumn({
  order,
  placedTimeDisplay,
}: OrderDetailMetaColumnProps): React.JSX.Element {
  return (
    <div className="flex">
      <div className="flex-1 my-3">
        <div className="my-1 bg-[#D9CAF8] dark:bg-purple-950/20 flex items-center mx-3 rounded-[3px]">
          <span className="text-[10px] font-medium p-0.5 ml-1.5 text-[#765FAC]">
            FOODRUSH - DELIVERY
          </span>
        </div>

        <div className="px-4 pt-2 flex flex-col flex-1 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className={cn(tokens.fontSizes.body, "text-zinc-900 dark:text-white")}>
                ID: <span className="font-medium">{order.id.slice(-4)}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 border-b pb-3">
              <PrintButton label="KOT" />
              <PrintButton label="ORDER" />
            </div>
          </div>

          <div className="space-y-1 border-b pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-normal text-zinc-800 dark:text-white">
                {order.customerName}
              </span>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 text-[12px] font-medium cursor-pointer",
                  tokens.colors.primaryText,
                  "hover:text-[#B8433A]",
                )}
              >
                <PhoneOutgoing className="h-3 w-3" /> Call
              </button>
            </div>
            <p className="text-[10px] font-normal">10th order</p>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-400 font-normal flex items-start gap-0.5 mt-1 leading-relaxed">
              TC Palya, KR Puram (1 km, 7 mins away)
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-normal text-zinc-500 dark:text-zinc-400">
              Placed:{" "}
              <span className="font-medium text-[12px] text-zinc-800 dark:text-zinc-200">
                {placedTimeDisplay}
              </span>
            </span>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 text-[11.5px] font-medium cursor-pointer",
                tokens.colors.primaryText,
                "hover:text-[#B8433A]",
              )}
            >
              <Clock className="h-3 w-3" /> Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
