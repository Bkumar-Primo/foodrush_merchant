import { MapPin, Motorbike } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { riderAvatar, riderCallRow } from "./orderDetailRiderUi";
import type { SimulatedRider } from "./orderDetailUtils";

interface PreparingRiderPanelProps {
  rider: SimulatedRider;
  isRiderArrived: boolean;
}

export function PreparingRiderPanel({
  rider,
  isRiderArrived,
}: PreparingRiderPanelProps): React.JSX.Element {
  if (isRiderArrived) {
    return (
      <div className={cn("border rounded-xl p-3", tokens.colors.border, tokens.colors.cardBg)}>
        <div className="flex items-start gap-3">
          {riderAvatar(rider)}
          <div className="min-w-0 flex-1 space-y-0.5">
            <p className={cn(tokens.fontSizes.body, tokens.colors.textPrimary, "truncate")}>
              {rider.name} has arrived
            </p>
            {riderCallRow(rider)}
            <button
              type="button"
              className={cn(
                "text-[10px] font-semibold hover:underline flex items-center gap-1",
                tokens.colors.primaryText,
              )}
            >
              <MapPin className="h-3 w-3" /> Track location
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border rounded-xl p-3.5 bg-white flex items-center gap-2.5",
        tokens.colors.border,
      )}
    >
      <Motorbike className="h-5 w-5 text-zinc-700 shrink-0" />
      <span className="text-[11px] font-bold text-zinc-600 leading-snug">
        4 riders nearby, assigning one soon
      </span>
    </div>
  );
}
