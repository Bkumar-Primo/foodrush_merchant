import type { OrderTab } from "@/types";
import { PickedUpRiderPanel } from "./OrderDetailRiderPickedUpPanel";
import { PreparingRiderPanel } from "./OrderDetailRiderPreparingPanel";
import { ReadyRiderPanel } from "./OrderDetailRiderReadyPanel";
import { OrderDetailSupportLinks } from "./OrderDetailSupportLinks";
import type { SimulatedRider } from "./orderDetailUtils";
import type { UniformFeedback } from "./useOrderDetailState";

interface OrderDetailRiderColumnProps {
  activeTab: OrderTab;
  orderId: string;
  rider: SimulatedRider;
  isRiderArrived: boolean;
  uniformFeedback: UniformFeedback;
  setUniformFeedback: (feedback: UniformFeedback) => void;
  onDispatch: (id: string) => void | Promise<void>;
}

export function OrderDetailRiderColumn({
  activeTab,
  orderId,
  rider,
  isRiderArrived,
  uniformFeedback,
  setUniformFeedback,
  onDispatch,
}: OrderDetailRiderColumnProps): React.JSX.Element {
  return (
    <div className="flex flex-col p-4 gap-5">
      {activeTab === "preparing" && (
        <PreparingRiderPanel rider={rider} isRiderArrived={isRiderArrived} />
      )}

      {activeTab === "ready" && (
        <ReadyRiderPanel rider={rider} orderId={orderId} onDispatch={onDispatch} />
      )}

      {activeTab === "picked_up" && (
        <PickedUpRiderPanel
          rider={rider}
          uniformFeedback={uniformFeedback}
          setUniformFeedback={setUniformFeedback}
        />
      )}

      <OrderDetailSupportLinks />
    </div>
  );
}
