"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
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
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F7F3EE]">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
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
