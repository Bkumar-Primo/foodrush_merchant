"use client";

import type { ReactNode } from "react";
import { DashboardProvider } from "./DashboardProvider";
import { DashboardShell } from "./DashboardShell";

interface DashboardLayoutClientProps {
  children: ReactNode;
}

export function DashboardLayoutClient({ children }: DashboardLayoutClientProps): React.JSX.Element {
  return (
    <DashboardProvider>
      <DashboardShell>{children}</DashboardShell>
    </DashboardProvider>
  );
}
