import { formatCountdown } from "./orderBillingUtils";

interface NewOrderFooterActionsProps {
  isAccepting: boolean;
  isAccepted: boolean;
  timeLeft: number;
  progressPercent: number;
  onReject: () => void;
  onAccept: () => void;
}

export function NewOrderFooterActions({
  isAccepting,
  isAccepted,
  timeLeft,
  progressPercent,
  onReject,
  onAccept,
}: NewOrderFooterActionsProps): React.JSX.Element {
  return (
    <div className="px-5 py-3 border-t border-zinc-150 dark:border-zinc-800 flex items-center gap-3 bg-white dark:bg-zinc-900 shrink-0">
      <button
        type="button"
        onClick={onReject}
        disabled={isAccepting || isAccepted}
        className="w-[30%] min-h-10 border border-red-600 dark:border-red-500 bg-transparent text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-md py-2.5 text-xs font-black transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-center"
      >
        Reject
      </button>
      <button
        type="button"
        onClick={onAccept}
        disabled={isAccepting}
        className="relative w-[70%] min-h-10 bg-[#249B5E] hover:bg-[#1E8650] disabled:hover:bg-[#249B5E] text-white rounded-md py-2.5 text-xs font-black transition-all cursor-pointer disabled:cursor-not-allowed overflow-hidden text-center active:scale-[0.99] disabled:active:scale-100 flex items-center justify-center"
      >
        {!isAccepting && (
          <div
            className="absolute top-0 right-0 bottom-0 bg-[#2EBD7C]/95 transition-all duration-1000 ease-linear pointer-events-none"
            style={{ width: `${100 - progressPercent}%` }}
          />
        )}
        {isAccepting ? (
          <span className="relative z-10 flex h-4 items-center justify-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:0ms]" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:200ms]" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:400ms]" />
          </span>
        ) : (
          <span className="relative z-10">Accept order ({formatCountdown(timeLeft)})</span>
        )}
      </button>
    </div>
  );
}
