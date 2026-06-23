export function HeaderBrand(): React.JSX.Element {
  return (
    <div className="flex flex-col select-none shrink-0">
      <span className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight leading-none">
        FoodRush
      </span>
      <span className="text-[8px] font-bold text-zinc-400 dark:text-zinc-500 tracking-widest uppercase mt-0.5">
        — merchant console —
      </span>
    </div>
  );
}
