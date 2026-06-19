"use client";

import { BellRing, ChevronDown, Play, Square, RotateCcw, Volume2, XIcon } from "lucide-react";
import React from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { clearLocalDatabase } from "@/lib/db/firebase";
import { useDashboardStore, RINGTONE_MAP, type RingtoneOption } from "@/stores/useDashboardStore";
import { useAudioChime } from "@/hooks/useAudioChime";

export const SettingsSheet: React.FC = () => {
  const {
    settingsOpen,
    setSettingsOpen,
    soundEnabled,
    setSoundEnabled,
    selectedRingtone,
    setSelectedRingtone,
    volume,
    setVolume,
    clearAll,
  } = useDashboardStore();

  // Local state for non-Zustand demo settings
  const [orderAlerts, setOrderAlerts] = React.useState(true);
  const { previewRingtone, stopChime, isPlaying } = useAudioChime();

  const handleRingtoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as RingtoneOption;
    setSelectedRingtone(value);
  };

  const handlePreview = () => {
    if (!soundEnabled) return;
    if (isPlaying) {
      stopChime();
    } else {
      previewRingtone(selectedRingtone);
    }
  };

  const handleResetDb = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to clear all simulation orders? This will reset the dashboard state.",
    );
    if (confirmReset) {
      await clearLocalDatabase();
      clearAll();
      alert("Database successfully reset!");
    }
  };

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex flex-col p-0 h-full overflow-hidden bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
      >
        {/* Fixed Header */}
        <SheetHeader className="px-6 py-1 border-b border-zinc-100 dark:border-zinc-900 shrink-0 flex flex-row items-center justify-between">
          <SheetTitle className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
            Settings
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Management Section */}
          <div className="space-y-5 pb-6 border-b border-zinc-100 dark:border-zinc-900">
            <h4 className="text-md font-bold text-black capitalize tracking-widest">
              Order management
            </h4>

            {/* Toggle 1: Order Alerts */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-2">
                  <BellRing className="h-4 w-4 text-zinc-400 shrink-0" />
                  Order alerts
                </span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal pl-6">
                  You will receive all order related alerts on this device.
                </p>
              </div>
              <div className="shrink-0 mt-0.5">
                <Switch checked={orderAlerts} onCheckedChange={setOrderAlerts} />
              </div>
            </div>

            {/* Toggle 2: Sound Alerts */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-200 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-zinc-400 shrink-0" />
                  Sound alerts
                </span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal pl-6">
                  You will receive sound alerts on this device.
                </p>
              </div>
              <div className="shrink-0 mt-0.5">
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>

            {/* Ringtone Selection */}
            <div className="space-y-1.5 pl-6 pt-1">
              <label
                htmlFor="ringtone-select"
                className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
              >
                Select ringtone
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <select
                    id="ringtone-select"
                    value={selectedRingtone}
                    onChange={handleRingtoneChange}
                    disabled={!soundEnabled}
                    className="w-full appearance-none rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-3 pr-8 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {(Object.entries(RINGTONE_MAP) as [RingtoneOption, { label: string; file: string }][]).map(
                      ([key, { label }]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ),
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                </div>
                <button
                  onClick={handlePreview}
                  disabled={!soundEnabled}
                  className={`flex items-center justify-center h-8 w-8 rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0 ${
                    isPlaying
                      ? "bg-[#22c55e] border-[#22c55e] text-white hover:bg-[#16a34a]"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                  }`}
                  title={isPlaying ? "Stop preview" : "Preview ringtone"}
                >
                  {isPlaying ? <Square className="h-3 w-3 fill-current" /> : <Play className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1.5 pl-6 pt-1">
              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <span>Volume</span>
                <span>{volume}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={1}
                value={[volume]}
                onValueChange={(vals) => setVolume(vals[0])}
                disabled={!soundEnabled}
                className="w-full py-2"
              />
            </div>
          </div>

          {/* Danger Zone Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-red-500 uppercase tracking-widest">
              Danger Zone
            </h4>
            <div className="rounded-xl border border-red-200/50 bg-red-50/10 dark:border-red-900/30 dark:bg-red-950/10 p-4 space-y-3">
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Resets all local client simulations, database orders, and map vectors.
              </p>
              <button
                onClick={handleResetDb}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 transition-colors shadow-sm cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Local Database
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsSheet;
