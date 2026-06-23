import { Check } from "lucide-react";
import type { Order } from "@/types";
import {
  buildTimeline,
  formatHistoryTime,
  getDeliveryDurationMins,
} from "../../utils/orderHistoryUtils";

interface OrderHistoryTimelineProps {
  order: Order;
}

export function OrderHistoryTimeline({ order }: OrderHistoryTimelineProps): React.JSX.Element {
  const steps = buildTimeline(order);
  const duration = getDeliveryDurationMins(order);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Order timeline</h4>
        {duration !== null && (
          <span className="text-[11px] font-medium text-zinc-500">
            Delivered in {duration} minutes
          </span>
        )}
      </div>

      <div className="flex items-start justify-between overflow-x-auto pb-1 relative">
        {steps.map((step, idx) => {
          const isComplete = step.timestamp !== null;
          const isLast = idx === steps.length - 1;
          const ts = step.timestamp;

          return (
            <div
              key={step.key}
              className="relative flex flex-col items-center flex-1 min-w-[72px] z-10"
            >
              {!isLast && (
                <div
                  className={`absolute left-1/2 top-2.5 -translate-y-1/2 h-[3px] -z-10 ${
                    isComplete ? "bg-[#0DB082]" : "bg-zinc-205 dark:bg-zinc-705"
                  }`}
                  style={{ width: "100%" }}
                />
              )}

              <div
                className={`flex items-center justify-center h-5 w-5 rounded-full shrink-0 border-2 ${
                  isComplete
                    ? "bg-[#0DB082] border-[#0DB082] text-white"
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-300 dark:text-zinc-650"
                }`}
              >
                {isComplete ? (
                  <Check className="h-2.5 w-2.5" strokeWidth={4} />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-650" />
                )}
              </div>

              <p className="text-[9px] font-semibold text-zinc-600 dark:text-zinc-400 text-center mt-2 leading-tight px-0.5">
                {step.label}
              </p>
              {ts !== null && (
                <p className="text-[9px] text-zinc-400 mt-0.5 text-center">
                  {formatHistoryTime(ts)}
                </p>
              )}
              {step.showView && ts !== null && (
                <button
                  type="button"
                  className="text-[9px] font-semibold text-blue-600 mt-0.5 hover:underline cursor-pointer"
                >
                  View
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
