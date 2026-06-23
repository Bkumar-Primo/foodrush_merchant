"use client";

import { useMemo, useState } from "react";
import { useOrders } from "@/features/orders/hooks/useOrders";
import { useNow } from "@/hooks/useNow";
import { getOrderTimeLeft, useVisibleNotifications } from "@/hooks/useVisibleNotifications";
import { tokens } from "@/lib/utils/tokens";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { UserProfile } from "@/types";
import { HeaderBrand } from "./HeaderBrand";
import { HeaderIconButtons } from "./HeaderIconButtons";
import { HeaderMerchantStatus } from "./HeaderMerchantStatus";
import { HeaderProfilePill } from "./HeaderProfilePill";
import { HeaderThemeToggle } from "./HeaderThemeToggle";

interface HeaderProps {
  userProfile: UserProfile;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export function Header({ userProfile, theme, toggleTheme }: HeaderProps): React.JSX.Element {
  const { merchantStatus, setMerchantStatus } = useDashboardStore();
  const { visibleNotifications } = useVisibleNotifications();
  const orders = useOrders();
  const now = useNow();

  const [showOfflineConfirm, setShowOfflineConfirm] = useState(false);
  const [showOngoingOfflineWarning, setShowOngoingOfflineWarning] = useState(false);

  const ongoingOrders = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.status === "placed" ||
          o.status === "preparing" ||
          o.status === "ready_for_pickup" ||
          o.status === "dispatched",
      ),
    [orders],
  );

  const hasOngoing = ongoingOrders.length > 0;

  const hasUnread = useMemo(
    () => visibleNotifications.some((n) => !n.read),
    [visibleNotifications],
  );

  const isUrgent = useMemo(() => {
    return visibleNotifications.some((n) => {
      if (n.read || !n.orderId) return false;
      const order = orders.find((o) => o.id === n.orderId);
      if (order?.status !== "placed") return false;
      const timeLeft = getOrderTimeLeft(order.createdAt, now);
      return timeLeft > 0 && timeLeft < 60;
    });
  }, [visibleNotifications, orders, now]);

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
          hasOngoing={hasOngoing}
          showOfflineConfirm={showOfflineConfirm}
          showOngoingOfflineWarning={showOngoingOfflineWarning}
          onShowOfflineConfirm={setShowOfflineConfirm}
          onShowOngoingOfflineWarning={setShowOngoingOfflineWarning}
          onGoOffline={() => setMerchantStatus("Offline")}
          onGoOnline={() => setMerchantStatus("Online")}
        />
        <HeaderProfilePill userProfile={userProfile} />
      </div>
    </header>
  );
}

export default Header;
