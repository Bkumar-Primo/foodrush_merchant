import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";
import { DashboardSplashGate } from "@/components/dashboard/DashboardSplashGate";

export const metadata: Metadata = {
  title: "Dashboard | Delivrn Merchant",
  description: "Manage orders, menu, and store operations",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  return (
    <Suspense fallback={null}>
      <DashboardSplashGate>
        <DashboardLayoutClient>{children}</DashboardLayoutClient>
      </DashboardSplashGate>
    </Suspense>
  );
}
