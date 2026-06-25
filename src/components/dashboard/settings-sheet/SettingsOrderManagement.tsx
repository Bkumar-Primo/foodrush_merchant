"use client";

import { BellRing, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { SettingsRingtonePicker } from "./SettingsRingtonePicker";
import { SettingsVolumeSlider } from "./SettingsVolumeSlider";

interface SettingsOrderManagementProps {
  orderAlerts: boolean;
  onOrderAlertsChange: (enabled: boolean) => void;
  soundEnabled: boolean;
  onSoundEnabledChange: (enabled: boolean) => void;
  selectedRingtone: string;
  volume: number;
  isPlaying: boolean;
  onRingtoneChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPreview: () => void;
  onVolumeChange: (volume: number) => void;
}

export function SettingsOrderManagement({
  orderAlerts,
  onOrderAlertsChange,
  soundEnabled,
  onSoundEnabledChange,
  selectedRingtone,
  volume,
  isPlaying,
  onRingtoneChange,
  onPreview,
  onVolumeChange,
}: SettingsOrderManagementProps): React.JSX.Element {
  return (
    <div className="space-y-5 pb-6 border-b border-zinc-100 dark:border-zinc-900">
      <h4 className="text-md font-medium text-black capitalize tracking-widest">
        Order management
      </h4>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-xs font-medium text-zinc-850 dark:text-zinc-200 flex items-center gap-2">
            <BellRing className="h-4 w-4 text-zinc-400 shrink-0" />
            Order alerts
          </span>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal pl-6">
            You will receive all order related alerts on this device.
          </p>
        </div>
        <div className="shrink-0 mt-0.5">
          <Switch checked={orderAlerts} onCheckedChange={onOrderAlertsChange} />
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <span className="text-xs font-medium text-zinc-850 dark:text-zinc-200 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-zinc-400 shrink-0" />
            Sound alerts
          </span>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal pl-6">
            You will receive sound alerts on this device.
          </p>
        </div>
        <div className="shrink-0 mt-0.5">
          <Switch checked={soundEnabled} onCheckedChange={onSoundEnabledChange} />
        </div>
      </div>

      <SettingsRingtonePicker
        soundEnabled={soundEnabled}
        selectedRingtone={selectedRingtone}
        isPlaying={isPlaying}
        onRingtoneChange={onRingtoneChange}
        onPreview={onPreview}
      />

      <SettingsVolumeSlider
        soundEnabled={soundEnabled}
        volume={volume}
        onVolumeChange={onVolumeChange}
      />
    </div>
  );
}
