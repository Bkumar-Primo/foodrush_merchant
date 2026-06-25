"use client";

import { useAuth } from "@/lib/auth";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { HeaderProfilePill } from "./HeaderProfilePill";

export function HeaderProfileMenu(): React.JSX.Element {
  const { user, displayName } = useAuth();
  const setProfileSheetOpen = useDashboardStore((state) => state.setProfileSheetOpen);

  return (
    <button
      type="button"
      onClick={() => setProfileSheetOpen(true, "edit")}
      className="cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      aria-label="Open profile"
    >
      <HeaderProfilePill
        userProfile={{
          name: displayName,
          avatarUrl: user?.photoURL ?? undefined,
        }}
      />
    </button>
  );
}
