import type { Metadata } from "next";
import { DashboardLayoutClientShell } from "@/components/dashboard/DashboardLayoutClientShell";

export const metadata: Metadata = {
  title: "Dashboard | Delivrn Merchant",
  description: "Manage orders, menu, and store operations",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps): React.JSX.Element {
  return <DashboardLayoutClientShell>{children}</DashboardLayoutClientShell>;
}
