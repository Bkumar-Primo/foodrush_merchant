import { Bell } from "lucide-react";

export function NotificationsEmptyState(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
      <Bell className="h-8 w-8 text-zinc-350 dark:text-zinc-650" />
      <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">All caught up!</p>
      <p className="text-[10px] text-zinc-450 dark:text-zinc-500">
        No new notifications at this time.
      </p>
    </div>
  );
}
