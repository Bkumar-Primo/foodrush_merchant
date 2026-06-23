interface NewOrderScrollIndicatorProps {
  onScrollDown: () => void;
}

export function NewOrderScrollIndicator({
  onScrollDown,
}: NewOrderScrollIndicatorProps): React.JSX.Element {
  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <button
        type="button"
        onClick={onScrollDown}
        className="bg-[#3f3f46] hover:bg-[#52525b] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-lg border border-[#52525b] dark:border-[#3f3f46] transition-all active:scale-95"
      >
        <span>View more details</span>
        <svg
          viewBox="0 0 24 24"
          className="w-3 h-3 stroke-current fill-none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Scroll down</title>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
