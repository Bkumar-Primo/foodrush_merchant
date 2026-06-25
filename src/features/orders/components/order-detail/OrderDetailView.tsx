"use client";

import { cn } from "@/lib/utils";
import { tokens } from "@/lib/utils/tokens";
import type { Order, OrderTab } from "@/types";
import NeedMoreTimeModal from "../NeedMoreTimeModal";
import { OrderDetailItemsColumn } from "./OrderDetailItemsColumn";
import { OrderDetailMetaColumn } from "./OrderDetailMetaColumn";
import { OrderDetailRiderColumn } from "./OrderDetailRiderColumn";
import { useOrderDetailState } from "./useOrderDetailState";

interface OrderDetailViewProps {
  order: Order;
  activeTab: OrderTab;
  onReady: (id: string) => void | Promise<void>;
  onDispatch: (id: string) => void | Promise<void>;
}

export function OrderDetailView({
  order,
  activeTab,
  onReady,
  onDispatch,
}: OrderDetailViewProps): React.JSX.Element {
  const state = useOrderDetailState({ order, onReady });

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden shadow-xs",
        tokens.colors.borderHeavy,
        tokens.colors.cardBg,
      )}
    >
      <div className="grid grid-cols-[320px_1fr_320px] min-h-[250px]">
        <OrderDetailMetaColumn order={order} placedTimeDisplay={state.placedTimeDisplay} />

        <OrderDetailItemsColumn
          order={order}
          activeTab={activeTab}
          orderDietType={state.orderDietType}
          finalBill={state.bill.final}
          prepRemainingSecs={state.prepRemainingSecs}
          prepRemainingMins={state.prepRemainingMins}
          prepRemainingSecsRem={state.prepRemainingSecsRem}
          isReadyLoading={state.isReadyLoading}
          readyElapsedSecs={state.readyElapsedSecs}
          readyRemainingMins={state.readyRemainingMins}
          readyRemainingSecsRem={state.readyRemainingSecsRem}
          handoverProgress={state.handoverProgress}
          lateMins={state.lateMins}
          lateSecsRem={state.lateSecsRem}
          formatCountdown={state.formatCountdown}
          onReadyClick={state.handleReadyClick}
          onNeedMoreTime={() => state.setShowNeedMoreTime(true)}
        />

        <OrderDetailRiderColumn
          activeTab={activeTab}
          orderId={order.id}
          rider={state.rider}
          uniformFeedback={state.uniformFeedback}
          setUniformFeedback={state.setUniformFeedback}
          onDispatch={onDispatch}
        />
      </div>

      {state.showNeedMoreTime && (
        <NeedMoreTimeModal
          onClose={() => state.setShowNeedMoreTime(false)}
          onSubmit={state.handleExtraTimeSubmit}
        />
      )}
    </div>
  );
}

export default OrderDetailView;
