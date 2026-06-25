const FOOD_ORBIT_PATH = "M 20 52 Q 150 6 280 52";

export function FoodRushSplashOrbit(): React.JSX.Element {
  return (
    <div className="relative mx-auto h-[4.25rem] w-[min(88vw,18rem)]" aria-hidden="true">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 300 64"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path
          d={FOOD_ORBIT_PATH}
          fill="none"
          stroke="#E4E7EC"
          strokeWidth="2"
          strokeDasharray="5 7"
          strokeLinecap="round"
        />
      </svg>

      <div className="splash-food-orbit-item splash-food-orbit-item-1">
        <SplashFoodIcon type="bowl" />
      </div>
      <div className="splash-food-orbit-item splash-food-orbit-item-2">
        <SplashFoodIcon type="burger" />
      </div>
      <div className="splash-food-orbit-item splash-food-orbit-item-3">
        <SplashFoodIcon type="drink" />
      </div>
      <div className="splash-food-orbit-item splash-food-orbit-item-4">
        <SplashFoodIcon type="pizza" />
      </div>
    </div>
  );
}

type SplashFoodIconType = "bowl" | "burger" | "drink" | "pizza";

function SplashFoodIcon({ type }: { type: SplashFoodIconType }): React.JSX.Element {
  const className = "size-5 text-[#D4543C]";

  switch (type) {
    case "bowl":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 11h16c0 5-3.5 8-8 8s-8-3-8-8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M8 5l2-2 2 2M14 5l2-2 2 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "burger":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 9h16M4 13h16M6 17h12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M5 9c2-2 12-2 14 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "drink":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M9 3h6l-1 14H10L9 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M8 21h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M14 3c1 0 2 1 2 2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "pizza":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3 4 19c6-1 10-1 16 0L12 3Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="11" cy="12" r="1" fill="currentColor" />
          <circle cx="14" cy="15" r="1" fill="currentColor" />
          <circle cx="13" cy="10" r="1" fill="currentColor" />
        </svg>
      );
  }
}
