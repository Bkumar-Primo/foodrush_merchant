"use client";

import { XIcon } from "lucide-react";
import { PROFILE_COPY } from "@/components/dashboard/constants";
import { Button } from "@/components/ui/button";
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function ProfileSheetHeader(): React.JSX.Element {
  return (
    <SheetHeader className="px-6 py-1 border-b border-zinc-100 dark:border-zinc-900 shrink-0 flex flex-row items-center justify-between">
      <SheetTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100">
        {PROFILE_COPY.title}
      </SheetTitle>
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
