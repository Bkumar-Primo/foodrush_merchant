import type { ToastMessage } from "./types";

interface MenuEditorToastProps {
  message: ToastMessage | null;
}

export function MenuEditorToast({ message }: MenuEditorToastProps): React.JSX.Element | null {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#F5FBFC] dark:bg-zinc-900 border border-emerald-500/50 rounded-xl px-4.5 py-3.5 shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 text-left">
      <div className="size-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
      <div>
        <span className="text-xs font-medium text-zinc-900 dark:text-white block">
          {message.title}
        </span>
        <span className="text-[10px] text-zinc-450 mt-0.5 block">{message.desc}</span>
      </div>
    </div>
  );
}
