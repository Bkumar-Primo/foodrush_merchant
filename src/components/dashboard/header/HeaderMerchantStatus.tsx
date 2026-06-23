"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toggle } from "@/components/ui/toggle";
import type { MerchantStatus } from "@/types";

interface HeaderMerchantStatusProps {
  merchantStatus: MerchantStatus;
  hasOngoing: boolean;
  showOfflineConfirm: boolean;
  showOngoingOfflineWarning: boolean;
  onShowOfflineConfirm: (open: boolean) => void;
  onShowOngoingOfflineWarning: (open: boolean) => void;
  onGoOffline: () => void;
  onGoOnline: () => void;
}

export function HeaderMerchantStatus({
  merchantStatus,
  hasOngoing,
  showOfflineConfirm,
  showOngoingOfflineWarning,
  onShowOfflineConfirm,
  onShowOngoingOfflineWarning,
  onGoOffline,
  onGoOnline,
}: HeaderMerchantStatusProps): React.JSX.Element {
  return (
    <>
      <Toggle
        pressed={merchantStatus === "Online"}
        onPressedChange={(pressed) => {
          if (pressed) {
            onGoOnline();
          } else if (hasOngoing) {
            onShowOngoingOfflineWarning(true);
          } else {
            onShowOfflineConfirm(true);
          }
        }}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer select-none ${
          merchantStatus === "Online"
            ? "border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/50 dark:border-emerald-900 dark:bg-emerald-950/25 dark:text-emerald-400 dark:hover:bg-emerald-950/40"
            : "border-rose-250 bg-rose-50 text-rose-700 hover:bg-rose-100/50 dark:border-rose-900 dark:bg-rose-950/25 dark:text-rose-400 dark:hover:bg-rose-950/40"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full transition-colors ${
            merchantStatus === "Online" ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />
        <span>{merchantStatus}</span>
      </Toggle>

      <AlertDialog open={showOfflineConfirm} onOpenChange={onShowOfflineConfirm}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Go Offline?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to go offline? You will stop receiving new order notifications
              on this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onGoOffline();
                onShowOfflineConfirm(false);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white"
            >
              Go Offline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showOngoingOfflineWarning} onOpenChange={onShowOngoingOfflineWarning}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-zinc-950 dark:text-white font-extrabold text-base">
                Blocked
              </span>
            </AlertDialogTitle>
            <div className="pt-2">
              <Alert
                variant="destructive"
                className="bg-red-50/50 border-red-200 text-red-850 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300"
              >
                <AlertCircle className="h-4 w-4 text-red-650 dark:text-red-500" />
                <AlertTitle className="font-extrabold text-xs">Active Orders Ongoing</AlertTitle>
                <AlertDescription className="text-[11px] leading-relaxed font-bold">
                  You cannot go offline while there are active orders. Please complete or reject
                  them first.
                </AlertDescription>
              </Alert>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              onClick={() => onShowOngoingOfflineWarning(false)}
              className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs cursor-pointer"
            >
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
