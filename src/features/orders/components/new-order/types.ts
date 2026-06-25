import type { Order } from "@/types";

export interface NewOrderModalProps {
  order: Order;
  onAccept: (orderId: string, prepTime: number) => Promise<void>;
  onReject: (orderId: string) => Promise<void>;
  onDismiss: () => void;
  onMinimize?: () => void;
}

export interface OrderBilling {
  itemTotal: number;
  taxes: number;
  discount: number;
  finalBill: number;
}
