import { Volume2, VolumeX, XIcon } from "lucide-react";

interface NewOrderModalHeaderProps {
  isMuted: boolean;
  onMuteToggle: () => void;
  onClose: () => void;
}

export function NewOrderModalHeader({
  isMuted,
  onMuteToggle,
  onClose,
}: NewOrderModalHeaderProps): React.JSX.Element {
  return (
    <div className="px-5 py-2.5 flex items-center justify-between">
      <span className="font-medium text-base text-zinc-900 dark:text-white">1 new order</span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onMuteToggle}
          className="flex items-center gap-1 px-2.5 py-0.5 border border-primary rounded-sm text-[11px] font-medium text-primary hover:bg-[#D4543C]/10 dark:hover:bg-[#D4543C]/15 cursor-pointer transition-colors"
        >
          {!isMuted ? (
            <span className="flex items-center gap-1">
              <span>Mute</span>
              <Volume2 className="h-3 w-3 text-primary" />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span>Unmute</span>
              <VolumeX className="h-3 w-3 text-zinc-400" />
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer ml-1"
        >
          <XIcon className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
