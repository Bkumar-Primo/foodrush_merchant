import type { Metadata } from "next";
import { DashboardLayoutClientShell } from "@/components/dashboard/DashboardLayoutClientShell";
import { BRAND_METADATA } from "@/lib/constants";

export const metadata: Metadata = {
  title: BRAND_METADATA.dashboardTitle,
  description: BRAND_METADATA.dashboardDescription,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  return <DashboardLayoutClientShell>{children}</DashboardLayoutClientShell>;
}
