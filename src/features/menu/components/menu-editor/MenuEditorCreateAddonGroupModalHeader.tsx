import { X } from "lucide-react";

interface MenuEditorCreateAddonGroupModalHeaderProps {
  onClose: () => void;
}

export function MenuEditorCreateAddonGroupModalHeader({
  onClose,
}: MenuEditorCreateAddonGroupModalHeaderProps): React.JSX.Element {
  return (
    <div className="flex items-center justify-between shrink-0">
      <h3 className="text-sm font-medium text-zinc-900 dark:text-white uppercase tracking-wider">
        Create Addon Group
      </h3>
      <button
        type="button"
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200 cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
