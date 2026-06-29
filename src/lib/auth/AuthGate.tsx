"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth/AuthProvider";

interface AuthGateProps {
  children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps): React.JSX.Element {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F3EE]">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
