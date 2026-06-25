"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { BRAND } from "@/lib/constants";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps): React.JSX.Element | null {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EE]">
        <p className="text-sm font-medium text-zinc-600">{BRAND.loadingLabel}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
