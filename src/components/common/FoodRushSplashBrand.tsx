import { BRAND } from "@/lib/constants";

export function FoodRushSplashBrand(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <h1 className="flex items-baseline text-[2.35rem] font-black italic leading-none tracking-tight sm:text-[2.65rem]">
        <span className="splash-brand-food text-[#121619]">{BRAND.nameFood}</span>
        <span className="splash-brand-rush inline-flex items-center text-[#D4543C]">
          {BRAND.nameRush}
          <span className="splash-brand-streaks ml-2 flex flex-col gap-1" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </span>
      </h1>
      <p className="splash-brand-tagline text-[0.62rem] font-medium uppercase tracking-[0.38em] text-[#98A2B3]">
        {BRAND.merchantDashboardTagline}
      </p>
    </div>
  );
}
