"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SETTINGS_COPY } from "@/components/dashboard/constants/settings";
import { AUTH_ROUTES } from "@/features/auth/constants";
import { signOutUser, useAuth } from "@/lib/auth";

export function SettingsAccount(): React.JSX.Element {
  const { displayName, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
      router.replace(AUTH_ROUTES.login);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-black capitalize tracking-widest">
        {SETTINGS_COPY.accountTitle}
      </h4>
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-3">
        <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{displayName}</p>
        {user?.email ? (
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{user.email}</p>
        ) : null}
        <button
          type="button"
          onClick={() => void handleSignOut()}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          {loading ? SETTINGS_COPY.signingOut : SETTINGS_COPY.signOut}
        </button>
      </div>
    </div>
  );
}
