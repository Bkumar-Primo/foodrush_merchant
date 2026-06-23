export function FoodRushSplashLoading(): React.JSX.Element {
  return (
    <div className="splash-loading flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="splash-loading-dot splash-loading-dot-1 size-2 rounded-full bg-[#F9B091]" />
        <span className="splash-loading-dot splash-loading-dot-2 size-3 rounded-full bg-[#F26522]" />
        <span className="splash-loading-dot splash-loading-dot-3 size-2 rounded-full bg-[#F9B091]" />
      </div>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.35em] text-[#98A2B3]">
        Loading...
      </p>
    </div>
  );
}
