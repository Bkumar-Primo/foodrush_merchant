"use client";

import { Slider } from "@/components/ui/slider";

interface SettingsVolumeSliderProps {
  soundEnabled: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export function SettingsVolumeSlider({
  soundEnabled,
  volume,
  onVolumeChange,
}: SettingsVolumeSliderProps): React.JSX.Element {
  return (
    <div className="space-y-1.5 pl-6 pt-1">
      <div className="flex justify-between items-center text-[10px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        <span>Volume</span>
        <span>{volume}%</span>
      </div>
      <Slider
        min={0}
        max={100}
        step={1}
        value={[volume]}
        onValueChange={(vals) => onVolumeChange(vals[0])}
        disabled={!soundEnabled}
        className="w-full py-2"
      />
    </div>
  );
}
