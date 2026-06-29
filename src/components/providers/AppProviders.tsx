"use client";

import type { ReactNode } from "react";
import { AppSplashGate } from "@/components/common/AppSplashGate";
import { AuthProvider } from "@/lib/auth";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  return (
    <AuthProvider>
      <AppSplashGate>{children}</AppSplashGate>
    </AuthProvider>
  );
}
