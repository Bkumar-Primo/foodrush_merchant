"use client";

import { Cloud, CloudOff } from "lucide-react";
import { useEffect, useState } from "react";
import { SETTINGS_COPY } from "@/components/dashboard/constants/settings";
import { getFirebaseProjectId, isFirebaseConfiguredOnClient } from "@/lib/db";

export function SettingsFirebaseStatus(): React.JSX.Element {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    setConfigured(isFirebaseConfiguredOnClient());
    setProjectId(getFirebaseProjectId());
  }, []);

  return (
    <div className="space-y-4 pb-6 border-b border-zinc-100 dark:border-zinc-900">
      <h4 className="text-md font-medium text-black capitalize tracking-widest">
        {SETTINGS_COPY.firebaseTitle}
      </h4>

      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 space-y-3">
        <div className="flex items-center gap-2">
          {configured ? (
            <Cloud className="h-4 w-4 text-emerald-500 shrink-0" />
          ) : (
            <CloudOff className="h-4 w-4 text-red-500 shrink-0" />
          )}
          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
            {configured ? SETTINGS_COPY.firebaseConnected : SETTINGS_COPY.firebaseNotConfigured}
          </span>
        </div>

        {configured && projectId ? (
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
            {SETTINGS_COPY.firebaseProjectLabel}:{" "}
            <span className="font-mono text-zinc-700 dark:text-zinc-300">{projectId}</span>
          </p>
        ) : null}

        {!configured ? (
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
            {SETTINGS_COPY.firebaseSetupHint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
