"use client";

import { NewOrderAcceptedView } from "./NewOrderAcceptedView";
import { NewOrderCustomerInfo } from "./NewOrderCustomerInfo";
import { NewOrderFooterActions } from "./NewOrderFooterActions";
import { NewOrderModalBanner } from "./NewOrderModalBanner";
import { NewOrderModalHeader } from "./NewOrderModalHeader";
import { NewOrderRejectConfirm } from "./NewOrderRejectConfirm";
import { NewOrderScrollableContent } from "./NewOrderScrollableContent";
import { getOrderBilling } from "./orderBillingUtils";
import type { NewOrderModalProps } from "./types";
import { useNewOrderModal } from "./useNewOrderModal";

export function NewOrderModal({
  order,
  onAccept,
  onReject,
  onDismiss,
  onMinimize,
}: NewOrderModalProps): React.JSX.Element {
  const billing = getOrderBilling(order);
  const modal = useNewOrderModal({ order, onAccept, onReject, onDismiss, onMinimize });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[525px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        <NewOrderModalHeader
          isMuted={modal.isMuted}
          onMuteToggle={modal.handleMuteToggle}
          onClose={modal.handleClose}
        />

        <div className="p-4 flex-1 bg-[#F9FAFB] dark:bg-zinc-950">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900 shadow-xs flex flex-col max-h-[445px]">
            <div className="flex flex-col shrink-0">
              <NewOrderModalBanner />
              {!modal.isAccepted && (
                <NewOrderCustomerInfo order={order} isSimulatedLitti={billing.isSimulatedLitti} />
              )}
            </div>

            {modal.isAccepted ? (
              <NewOrderAcceptedView />
            ) : (
              <>
                <NewOrderScrollableContent
                  order={order}
                  billing={billing}
                  prepTime={modal.prepTime}
                  showScrollIndicator={modal.showScrollIndicator}
                  scrollRef={modal.scrollRef}
                  onScroll={modal.handleScroll}
                  onScrollDown={modal.handleScrollDown}
                  onIncrementPrepTime={modal.incrementTime}
                  onDecrementPrepTime={modal.decrementTime}
                />
                <NewOrderFooterActions
                  isAccepting={modal.isAccepting}
                  isAccepted={modal.isAccepted}
                  timeLeft={modal.timeLeft}
                  progressPercent={modal.progressPercent}
                  onReject={modal.handleRejectClick}
                  onAccept={modal.handleAcceptClick}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {modal.showConfirmReject && (
        <NewOrderRejectConfirm
          onCancel={() => modal.setShowConfirmReject(false)}
          onConfirm={modal.executeReject}
        />
      )}
    </div>
  );
}

export default NewOrderModal;
