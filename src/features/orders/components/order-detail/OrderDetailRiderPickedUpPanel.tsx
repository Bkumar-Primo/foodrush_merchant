import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { riderAvatar, riderCallRow } from "./orderDetailRiderUi";
import type { SimulatedRider } from "./orderDetailUtils";
import type { UniformFeedback } from "./useOrderDetailState";

interface PickedUpRiderPanelProps {
  rider: SimulatedRider;
  uniformFeedback: UniformFeedback;
  setUniformFeedback: (feedback: UniformFeedback) => void;
}

export function PickedUpRiderPanel({
  rider,
  uniformFeedback,
  setUniformFeedback,
}: PickedUpRiderPanelProps): React.JSX.Element {
  return (
    <div className="border rounded-lg space-y-4">
      <div className="border-b p-3 bg-[#F5FBFC] first:rounded-t-lg dark:border-green-900/30 dark:bg-green-950/15 flex items-center justify-between">
        <div className="space-y-0.5">
          <p className={cn(tokens.fontSizes.body, tokens.colors.textPrimary)}>
            Order was prepared in time
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
            Timely delivery to the customer
          </p>
        </div>
        <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-500 shrink-0" />
      </div>

      <div className="flex items-center gap-3 px-3">
        {riderAvatar(rider)}
        <div className="min-w-0 flex-1">
          <p className={cn(tokens.fontSizes.body, tokens.colors.textPrimary, "leading-tight")}>
            {rider.name} has picked up your order
          </p>
          {riderCallRow(rider)}
        </div>
      </div>

      <div className="space-y-1.5 px-3 pb-3 border-b">
        <div className="flex items-center justify-between text-[11px] font-medium text-zinc-550 dark:text-zinc-400">
          <span>Delivering in 12 mins</span>
        </div>
        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full w-[40%]" />
        </div>
      </div>

      <div className="px-3 pb-3">
        <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Was {rider.name} in uniform?
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUniformFeedback("no")}
            className={cn(
              "flex-1 py-1.5 rounded-md border text-[10px] font-medium cursor-pointer transition-colors text-center",
              uniformFeedback === "no"
                ? "bg-red-500 border-red-500 text-white"
                : "border-red-300 text-red-500 hover:bg-red-50/50",
            )}
          >
            No
          </button>
          <button
            type="button"
            onClick={() => setUniformFeedback("yes")}
            className={cn(
              "flex-1 py-1.5 rounded-md border text-[10px] font-medium cursor-pointer transition-colors text-center",
              uniformFeedback === "yes"
                ? "bg-green-600 border-green-600 text-white"
                : "border-green-300 text-green-600 hover:bg-green-50/50",
            )}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
