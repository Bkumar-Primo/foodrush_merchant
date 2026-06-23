"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OfflineSimulationAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoOnline: () => void;
}

export function OfflineSimulationAlert({
  open,
  onOpenChange,
  onGoOnline,
}: OfflineSimulationAlertProps): React.JSX.Element {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-zinc-950 dark:text-white font-extrabold text-base">
              Simulation Blocked
            </span>
          </AlertDialogTitle>
          <div className="pt-2">
            <Alert
              variant="destructive"
              className="bg-red-50/50 border-red-200 text-red-850 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300"
            >
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
              <AlertTitle className="font-extrabold text-xs">Offline Status</AlertTitle>
              <AlertDescription className="text-[11px] leading-relaxed font-bold">
                To start receiving orders, you need to go online first.
              </AlertDescription>
            </Alert>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="text-xs font-semibold cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onGoOnline}
            className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs cursor-pointer"
          >
            Go Online
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
