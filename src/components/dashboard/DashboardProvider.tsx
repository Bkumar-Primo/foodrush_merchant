"use client";

import { createContext, type ReactNode, useContext } from "react";
import { useMerchantDashboard } from "./merchant-dashboard/useMerchantDashboard";

export type DashboardContextValue = ReturnType<typeof useMerchantDashboard>;

const DashboardContext = createContext<DashboardContextValue | null>(null);

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps): React.JSX.Element {
  const value = useMerchantDashboard();
  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard(): DashboardContextValue {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
}
