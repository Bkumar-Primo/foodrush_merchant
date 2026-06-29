import type { Metadata } from "next";
import { FoodRushSplash } from "@/components/common/FoodRushSplash";
import { DashboardLayoutClientShell } from "@/components/dashboard/DashboardLayoutClientShell";
import { SplashBootstrapScript } from "@/components/dashboard/SplashBootstrapScript";
import { SPLASH_DOM_IDS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Dashboard | Delivrn Merchant",
  description: "Manage orders, menu, and store operations",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  return (
    <>
      <SplashBootstrapScript />

      <div id={SPLASH_DOM_IDS.fallback}>
        <FoodRushSplash />
      </div>

      <DashboardLayoutClientShell>{children}</DashboardLayoutClientShell>
    </>
  );
}
