import { cn } from "@/lib/utils";
import { FoodRushSplashBrand } from "./FoodRushSplashBrand";
import { FoodRushSplashLoading } from "./FoodRushSplashLoading";
import { FoodRushSplashScene } from "./FoodRushSplashScene";

interface FoodRushSplashProps {
  exiting?: boolean;
}

export function FoodRushSplash({ exiting = false }: FoodRushSplashProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#FAFAFA] select-none",
        exiting ? "splash-overlay-exit" : "splash-overlay-enter",
      )}
      role="status"
      aria-label="Loading Food Rush"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-5 px-6 py-8">
        <FoodRushSplashScene exiting={exiting} />
        <FoodRushSplashBrand />
        <FoodRushSplashLoading />
      </div>
    </div>
  );
}
