import type { Metadata } from "next";
import Script from "next/script";
import { FoodRushSplash } from "@/components/common/FoodRushSplash";
import { DashboardLayoutClientShell } from "@/components/dashboard/DashboardLayoutClientShell";
import { createSplashBootstrapScript, SPLASH_DOM_IDS } from "@/lib/constants";

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
      <Script id="foodrush-splash-bootstrap" strategy="beforeInteractive">
        {createSplashBootstrapScript()}
      </Script>

      <div id={SPLASH_DOM_IDS.fallback}>
        <FoodRushSplash />
      </div>

      <DashboardLayoutClientShell>{children}</DashboardLayoutClientShell>
    </>
  );
}
