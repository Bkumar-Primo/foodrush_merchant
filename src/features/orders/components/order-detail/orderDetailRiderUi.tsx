import { PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { SimulatedRider } from "./orderDetailUtils";

export function riderAvatar(rider: SimulatedRider): React.JSX.Element {
  return (
    <img
      src={rider.avatar}
      alt={rider.name}
      className={cn(
        "w-10 h-10 rounded-full object-cover shrink-0 border",
        tokens.colors.borderHeavy,
      )}
    />
  );
}

export function riderCallRow(rider: SimulatedRider): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className={cn("flex items-center gap-1", tokens.colors.primaryText)}>
        <PhoneCall className="h-3 w-3" />
        <button
          type="button"
          className={cn(
            "text-[10px] font-medium cursor-pointer hover:underline",
            tokens.colors.primaryText,
          )}
        >
          Call
        </button>
      </div>
      <span className="text-[10px] text-zinc-300">|</span>
      <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
        OTP: <span className="text-zinc-400 dark:text-zinc-600">{rider.otp}</span>
      </span>
    </div>
  );
}
