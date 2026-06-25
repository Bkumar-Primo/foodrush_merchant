import Image from "next/image";
import { BRAND_ASSETS } from "@/lib/constants";

const SCOOTER_WIDTH = 352;
const SCOOTER_HEIGHT = 280;

interface FoodRushSplashSceneProps {
  exiting?: boolean;
}

export function FoodRushSplashScene({
  exiting = false,
}: FoodRushSplashSceneProps): React.JSX.Element {
  return (
    <div
      className={`relative mx-auto w-[min(88vw,22rem)] ${exiting ? "" : "splash-scene-enter"}`}
      aria-hidden="true"
    >
      <div className="relative flex h-[11.5rem] items-center justify-center sm:h-[12.5rem]">
        <div className="splash-scooter-rig relative w-full max-w-[22rem]">
          <Image
            src={BRAND_ASSETS.scooterImage}
            alt=""
            width={SCOOTER_WIDTH}
            height={SCOOTER_HEIGHT}
            priority
            draggable={false}
            className="pointer-events-none h-auto w-full select-none"
          />
        </div>
      </div>
    </div>
  );
}
