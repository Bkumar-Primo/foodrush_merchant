"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): React.JSX.Element {
  return <AuthProvider>{children}</AuthProvider>;
}
