"use client";

import { useMemo, useState } from "react";
import { useMerchantFirestoreSync } from "@/hooks/useMerchantFirestoreSync";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useNow } from "@/hooks/useNow";
import { getOrderTimeLeft, useVisibleNotifications } from "@/hooks/useVisibleNotifications";
import { updateMerchantStatus } from "@/lib/db/merchant";
import { getFirestoreDb } from "@/lib/db/firebaseClient";
import { tokens } from "@/lib/utils/tokens";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { HeaderBrand } from "./HeaderBrand";
import { HeaderIconButtons } from "./HeaderIconButtons";
import { HeaderMerchantStatus } from "./HeaderMerchantStatus";
import { HeaderProfileMenu } from "./HeaderProfileMenu";
import { HeaderThemeToggle } from "./HeaderThemeToggle";

interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Header({ theme, toggleTheme }: HeaderProps): React.JSX.Element {
  const { merchantStatus, setMerchantStatus } = useDashboardStore();
  const { visibleNotifications } = useVisibleNotifications();
  const orders = useOrders();
  const now = useNow();

  useMerchantFirestoreSync();

  const [showOfflineConfirm, setShowOfflineConfirm] = useState(false);
  const [showPendingOfflineWarning, setShowPendingOfflineWarning] = useState(false);
  const [showFulfillmentOfflineWarning, setShowFulfillmentOfflineWarning] =
    useState(false);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "placed"),
    [orders],
  );

  const fulfillmentOrders = useMemo(
    () =>
      orders.filter((order) =>
        ["preparing", "ready_for_pickup", "dispatched"].includes(order.status),
      ),
    [orders],
  );

  const hasPendingOrders = pendingOrders.length > 0;
  const hasFulfillmentOrders = fulfillmentOrders.length > 0;

  const hasUnread = useMemo(
    () => visibleNotifications.some((notification) => !notification.read),
    [visibleNotifications],
  );

  const isUrgent = useMemo(() => {
    return visibleNotifications.some((notification) => {
      if (notification.read || !notification.orderId) return false;
      const order = orders.find((entry) => entry.id === notification.orderId);
      if (order?.status !== "placed") return false;
      const timeLeft = getOrderTimeLeft(order.createdAt, now);
      return timeLeft > 0 && timeLeft < 60;
    });
  }, [visibleNotifications, orders, now]);

  async function persistMerchantStatus(status: typeof merchantStatus) {
    setMerchantStatus(status);
    if (!getFirestoreDb()) {
      return;
    }
    try {
      await updateMerchantStatus(status);
    } catch (error) {
      console.error("[Merchant] Failed to update status.", error);
    }
  }

  return (
    <header
      className={`flex h-16 items-center justify-between border-b ${tokens.colors.border} ${tokens.colors.headerBg} px-6 backdrop-blur-md relative z-50`}
    >
      <HeaderBrand />

      <div className="flex items-center gap-4.5">
        <HeaderIconButtons hasUnread={hasUnread} isUrgent={isUrgent} />
        <HeaderThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <HeaderMerchantStatus
          merchantStatus={merchantStatus}
          hasPendingOrders={hasPendingOrders}
          hasFulfillmentOrders={hasFulfillmentOrders}
          showOfflineConfirm={showOfflineConfirm}
          showPendingOfflineWarning={showPendingOfflineWarning}
          showFulfillmentOfflineWarning={showFulfillmentOfflineWarning}
          onShowOfflineConfirm={setShowOfflineConfirm}
          onShowPendingOfflineWarning={setShowPendingOfflineWarning}
          onShowFulfillmentOfflineWarning={setShowFulfillmentOfflineWarning}
          onGoOffline={() => void persistMerchantStatus("Offline")}
          onGoOnline={() => void persistMerchantStatus("Online")}
        />
        <HeaderProfileMenu />
      </div>
    </header>
  );
}

export default Header;
