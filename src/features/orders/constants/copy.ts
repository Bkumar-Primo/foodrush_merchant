export const ORDERS_PAGE_COPY = {
  emptyTitle: (tabLabel: string) => `No orders in ${tabLabel}`,
  emptySubtitle: "Orders will appear here when their status changes",
  preparingEmptyTitle: "Orders being prepared in your kitchen",
  preparingEmptySubtitle: "will appear here",
  sortByPlacedAt: "Placed at",
  sortByOrderId: "Order ID",
} as const;

export const NEW_ORDER_COPY = {
  banner: "FOODRUSH DELIVERY",
  rejectTitle: "Reject Order?",
  acceptOrder: "Accept order",
  cutleryWarning: "Don't send cutlery, tissues and straws",
} as const;

export const ORDER_DETAIL_COPY = {
  orderReady: "Order ready",
  needMoreTime: "Need more time",
  handoverFoodIn: "Handover food in",
} as const;

export const NEED_MORE_TIME_COPY = {
  title: "Need more time",
  subtitle: "Select extra preparation time",
  submit: "Submit",
} as const;
