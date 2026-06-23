"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAudioChime } from "@/hooks/useAudioChime";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { SettingsDangerZone } from "./SettingsDangerZone";
import { SettingsOrderManagement } from "./SettingsOrderManagement";
import { isRingtoneOption } from "./SettingsRingtonePicker";
import { SettingsSheetHeader } from "./SettingsSheetHeader";

export function SettingsSheet(): React.JSX.Element {
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

  const [orderAlerts, setOrderAlerts] = useState(true);
  const { previewRingtone, stopChime, isPlaying } = useAudioChime();

  const handleRingtoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (isRingtoneOption(value)) {
      setSelectedRingtone(value);
    }
  };

  const handlePreview = () => {
    if (!soundEnabled) return;
    if (isPlaying) {
      stopChime();
    } else {
      previewRingtone(selectedRingtone);
    }
  };

  return (
    <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex flex-col p-0 h-full overflow-hidden bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800"
      >
        <SettingsSheetHeader />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <SettingsOrderManagement
            orderAlerts={orderAlerts}
            onOrderAlertsChange={setOrderAlerts}
            soundEnabled={soundEnabled}
            onSoundEnabledChange={setSoundEnabled}
            selectedRingtone={selectedRingtone}
            volume={volume}
            isPlaying={isPlaying}
            onRingtoneChange={handleRingtoneChange}
            onPreview={handlePreview}
            onVolumeChange={setVolume}
          />

          <SettingsDangerZone onResetComplete={clearAll} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SettingsSheet;
