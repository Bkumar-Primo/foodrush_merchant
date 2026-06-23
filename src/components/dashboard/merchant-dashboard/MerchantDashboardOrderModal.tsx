"use client";

import NewOrderModal from "@/features/orders/components/NewOrderModal";
import { updateOrderStatus } from "@/lib/db";
import type { Order } from "@/types";

interface MerchantDashboardOrderModalProps {
  order: Order;
  onAccept: (orderId: string, prepTime: number) => Promise<void>;
  onClearModal: () => void;
  onMinimize: (order: Order) => void;
  removeMinimizedOrderId: (orderId: string) => void;
  resolveOrderNotification: (orderId: string) => void;
}

export function MerchantDashboardOrderModal({
  order,
  onAccept,
  onClearModal,
  onMinimize,
  removeMinimizedOrderId,
  resolveOrderNotification,
}: MerchantDashboardOrderModalProps): React.JSX.Element {
  return (
    <NewOrderModal
      key={order.id}
      order={order}
      onAccept={onAccept}
      onReject={async (orderId) => {
        await updateOrderStatus(orderId, "rejected");
        removeMinimizedOrderId(orderId);
        onClearModal();
        resolveOrderNotification(orderId);
      }}
      onMinimize={() => onMinimize(order)}
      onDismiss={onClearModal}
    />
  );
}
