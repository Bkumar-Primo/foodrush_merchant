export function NewOrderCutleryWarning(): React.JSX.Element {
  return (
    <div className="flex items-start">
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FFF2F2] dark:bg-rose-950/20 border border-[#FFE0E0] dark:border-rose-900/30 text-[9px] font-medium text-rose-655 dark:text-rose-400">
        <span className="w-3 h-3 rounded-lg bg-rose-500 flex items-center justify-center text-white shrink-0">
          <svg
            viewBox="0 0 24 24"
            className="w-2 h-2 fill-none stroke-current"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <title>No cutlery</title>
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14" />
          </svg>
        </span>
        Don&apos;t send cutlery, tissues and straws
      </span>
    </div>
  );
}
