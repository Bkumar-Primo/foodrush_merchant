import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { Order, OrderTab } from "@/types";
import { OrderDetailItemList } from "./OrderDetailItemList";
import { OrderDetailTabActions } from "./OrderDetailTabActions";
import type { OrderDietType } from "./orderDetailUtils";

interface OrderDetailItemsColumnProps {
  order: Order;
  activeTab: OrderTab;
  orderDietType: OrderDietType;
  finalBill: number;
  prepRemainingSecs: number;
  prepRemainingMins: number;
  prepRemainingSecsRem: number;
  isReadyLoading: boolean;
  readyElapsedSecs: number;
  readyRemainingMins: number;
  readyRemainingSecsRem: number;
  handoverProgress: number;
  lateMins: number;
  lateSecsRem: number;
  formatCountdown: (mins: number, secs: number) => string;
  onReadyClick: () => Promise<void>;
  onNeedMoreTime: () => void;
}

export function OrderDetailItemsColumn({
  order,
  activeTab,
  orderDietType,
  finalBill,
  prepRemainingSecs,
  prepRemainingMins,
  prepRemainingSecsRem,
  isReadyLoading,
  readyElapsedSecs,
  readyRemainingMins,
  readyRemainingSecsRem,
  handoverProgress,
  lateMins,
  lateSecsRem,
  formatCountdown,
  onReadyClick,
  onNeedMoreTime,
}: OrderDetailItemsColumnProps): React.JSX.Element {
  return (
    <div className="flex">
      <div
        className={cn("flex-1 my-3 border-r-2 border-l-2 border-dotted", tokens.colors.borderHeavy)}
      >
        <OrderDetailItemList order={order} orderDietType={orderDietType} finalBill={finalBill} />

        <div className="px-4 pt-3">
          <OrderDetailTabActions
            activeTab={activeTab}
            prepRemainingSecs={prepRemainingSecs}
            prepRemainingMins={prepRemainingMins}
            prepRemainingSecsRem={prepRemainingSecsRem}
            isReadyLoading={isReadyLoading}
            readyElapsedSecs={readyElapsedSecs}
            readyRemainingMins={readyRemainingMins}
            readyRemainingSecsRem={readyRemainingSecsRem}
            handoverProgress={handoverProgress}
            lateMins={lateMins}
            lateSecsRem={lateSecsRem}
            formatCountdown={formatCountdown}
            onReadyClick={onReadyClick}
            onNeedMoreTime={onNeedMoreTime}
          />
        </div>
      </div>
    </div>
  );
}
