"use client";

import { Suspense } from "react";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";
import { DashboardSplashGate } from "@/components/dashboard/DashboardSplashGate";
import { AuthGate } from "@/lib/auth";

interface DashboardLayoutClientShellProps {
  children: React.ReactNode;
}

export function DashboardLayoutClientShell({
  children,
}: DashboardLayoutClientShellProps): React.JSX.Element {
  return (
    <Suspense fallback={null}>
      <DashboardSplashGate>
        <AuthGate>
          <div data-dashboard-shell className="contents">
            <DashboardLayoutClient>{children}</DashboardLayoutClient>
          </div>
        </AuthGate>
      </DashboardSplashGate>
    </Suspense>
  );
}
