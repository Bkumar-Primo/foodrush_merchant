import { BrandButton } from "@/components/common/BrandButton";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import { riderAvatar, riderCallRow } from "./orderDetailRiderUi";
import type { SimulatedRider } from "./orderDetailUtils";

interface ReadyRiderPanelProps {
  rider: SimulatedRider;
  orderId: string;
  onDispatch: (id: string) => void | Promise<void>;
}

export function ReadyRiderPanel({
  rider,
  orderId,
  onDispatch,
}: ReadyRiderPanelProps): React.JSX.Element {
  return (
    <div className={cn("border rounded-xl p-3", tokens.colors.border, tokens.colors.cardBg)}>
      <div className="flex items-center gap-3">
        {riderAvatar(rider)}
        <div className="min-w-0 flex-1">
          <p className={cn(tokens.fontSizes.body, tokens.colors.textPrimary, "truncate")}>
            {rider.name} has arrived
          </p>
          {riderCallRow(rider)}
        </div>
      </div>
      <BrandButton
        variant="brand"
        fullWidth
        onClick={() => onDispatch(orderId)}
        className="mt-3 py-1.5 text-[10.5px] font-medium shadow-xs"
      >
        Handover Food
      </BrandButton>
    </div>
  );
}
