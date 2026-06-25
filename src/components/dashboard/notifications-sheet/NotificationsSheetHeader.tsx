"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface NotificationsSheetHeaderProps {
  unreadCount: number;
}

export function NotificationsSheetHeader({
  unreadCount,
}: NotificationsSheetHeaderProps): React.JSX.Element {
  return (
    <SheetHeader className="px-6 py-1 border-b border-zinc-100 dark:border-zinc-900 shrink-0 flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <SheetTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100">
          Notifications
        </SheetTitle>
        {unreadCount > 0 && (
          <span className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">
            {unreadCount} new
          </span>
        )}
      </div>
      <SheetClose asChild>
        <Button
          variant="ghost"
          className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer h-8 w-8 p-0"
          size="icon-sm"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </SheetClose>
    </SheetHeader>
  );
}
