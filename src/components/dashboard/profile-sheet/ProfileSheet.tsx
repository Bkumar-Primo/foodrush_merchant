"use client";

import { useEffect, useRef } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { ProfileAccountActions } from "./ProfileAccountActions";
import { ProfileEditForm } from "./ProfileEditForm";
import { ProfileSheetHeader } from "./ProfileSheetHeader";

export function ProfileSheet(): React.JSX.Element {
  const { profileSheetOpen, profileSheetSection, setProfileSheetOpen } = useDashboardStore();
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileSheetOpen || profileSheetSection !== "account") {
      return;
    }
    accountRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [profileSheetOpen, profileSheetSection]);

  return (
    <Sheet open={profileSheetOpen} onOpenChange={(open) => setProfileSheetOpen(open)}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex flex-col p-0 h-full overflow-hidden bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
      >
        <ProfileSheetHeader />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ProfileEditForm />
          <div ref={accountRef}>
            <ProfileAccountActions />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ProfileSheet;
