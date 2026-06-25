"use client";

import type { ReactNode } from "react";
import Header from "@/components/dashboard/Header";
import NotificationsSheet from "@/components/dashboard/NotificationsSheet";
import ProfileSheet from "@/components/dashboard/ProfileSheet";
import SettingsSheet from "@/components/dashboard/SettingsSheet";
import Sidebar from "@/components/dashboard/Sidebar";
import { tokens } from "@/lib/utils";
import { useDashboard } from "./DashboardProvider";
import { MerchantDashboardOrderModal } from "./merchant-dashboard/MerchantDashboardOrderModal";
import { OfflineSimulationAlert } from "./merchant-dashboard/OfflineSimulationAlert";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps): React.JSX.Element {
  const dashboard = useDashboard();

  return (
    <div
      className={`${dashboard.theme} flex flex-col h-screen w-screen overflow-hidden ${tokens.colors.pageBg} font-sans ${tokens.colors.textPrimary}`}
    >
      <Header
        theme={dashboard.theme}
        toggleTheme={dashboard.toggleTheme}
      />

      <div className="flex flex-1 overflow-hidden w-full">
        <Sidebar
          orders={dashboard.orders}
          activeTab={dashboard.activeTab}
          setActiveTab={dashboard.setActiveTab}
        />

        {children}
      </div>

      <SettingsSheet />
      <ProfileSheet />
      <NotificationsSheet />

      {dashboard.modalOrder && (
        <MerchantDashboardOrderModal
          order={dashboard.modalOrder}
          onAccept={dashboard.handleAccept}
          onClearModal={() => dashboard.setActiveModalOrderId(null)}
          onMinimize={dashboard.handleMinimizeOrder}
          removeMinimizedOrderId={dashboard.removeMinimizedOrderId}
          resolveOrderNotification={dashboard.resolveOrderNotification}
        />
      )}

      <OfflineSimulationAlert
        open={dashboard.showOnlineAlert}
        onOpenChange={dashboard.setShowOnlineAlert}
        onGoOnline={dashboard.handleGoOnline}
      />
    </div>
  );
}
