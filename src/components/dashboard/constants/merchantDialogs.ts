export const MERCHANT_DIALOG_COPY = {
  goOfflineTitle: "Go Offline?",
  goOfflineDescription:
    "Are you sure you want to go offline? You will stop receiving new order notifications on this device.",
  goOfflineAction: "Go Offline",
  pendingOrdersTitle: "New orders waiting",
  pendingOrdersDescription:
    "You have new orders that still need to be accepted or rejected. Please handle them before going offline.",
  fulfillmentOfflineTitle: "Orders still in progress",
  fulfillmentOfflineDescription:
    "Please wait until all picked-up orders are delivered. You can still force go offline if needed, but customers may not receive updates for active deliveries.",
  forceGoOfflineAction: "Force go offline",
  activeOrdersTitle: "Active Orders Ongoing",
  activeOrdersBlockDescription:
    "You cannot go offline while there are active orders. Please complete or reject them first.",
  blockedTitle: "Blocked",
  simulationBlockedTitle: "Simulation Blocked",
  offlineStatusTitle: "Offline Status",
  offlineStatusDescription: "To start receiving orders, you need to go online first.",
  goOnline: "Go Online",
  cancel: "Cancel",
  okay: "Okay",
  waitForDelivery: "Wait for delivery",
} as const;
