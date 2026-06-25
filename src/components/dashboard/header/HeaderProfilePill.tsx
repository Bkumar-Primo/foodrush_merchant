"use client";

import { User } from "lucide-react";
import type { UserProfile } from "@/types";

interface HeaderProfilePillProps {
  userProfile: UserProfile;
}

export function HeaderProfilePill({ userProfile }: HeaderProfilePillProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-zinc-200/80 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/40 px-1.5 py-1 shadow-sm">
      <div className="flex h-6 w-6 overflow-hidden items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
        {userProfile.avatarUrl ? (
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-3.5 w-3.5" />
        )}
      </div>
      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[100px]">
        {userProfile.name}
      </span>
    </div>
  );
}
