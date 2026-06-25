import { BRAND } from "@/lib/constants";
import { FoodRushSplashOrbit } from "./FoodRushSplashOrbit";

export function FoodRushSplashLoading(): React.JSX.Element {
  return (
    <div className="splash-loading flex w-[min(88vw,18rem)] flex-col items-center gap-3">
      <FoodRushSplashOrbit />

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#F4E8E4]">
        <div className="splash-loading-bar-fill h-full rounded-full bg-gradient-to-r from-[#D4543C] via-[#E06B52] to-[#F4A99A]" />
      </div>

      <p className="text-[0.62rem] font-medium uppercase tracking-[0.35em] text-[#98A2B3]">
        {BRAND.loadingLabel}
      </p>
    </div>
  );
}
