interface FoodRushSplashSceneProps {
  exiting?: boolean;
}

export function FoodRushSplashScene({ exiting = false }: FoodRushSplashSceneProps): React.JSX.Element {
  return (
    <div
      className={`relative mx-auto w-[min(88vw,22rem)] ${exiting ? "" : "splash-scene-enter"}`}
      aria-hidden="true"
    >
      <svg
        className="splash-arc pointer-events-none absolute -top-2 left-1/2 z-10 h-[13.5rem] w-[13.5rem] -translate-x-1/2"
        viewBox="0 0 220 220"
        fill="none"
      >
        <path
          className="splash-arc-path"
          d="M 42 168 C 48 92, 92 28, 168 54"
          stroke="#F26522"
          strokeWidth="11"
          strokeLinecap="round"
        />
      </svg>

      <div className="splash-trail-lines pointer-events-none absolute right-[18%] top-[42%] z-20 flex flex-col gap-2">
        <span className="splash-trail-line splash-trail-line-1" />
        <span className="splash-trail-line splash-trail-line-2" />
        <span className="splash-trail-line splash-trail-line-3" />
        <span className="splash-trail-line splash-trail-line-4" />
      </div>

      <div className="relative h-[13.75rem] overflow-hidden">
        <div className="splash-scooter-drive">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/foodrush-splash.png"
            alt=""
            className="pointer-events-none absolute left-1/2 top-0 w-[min(88vw,22rem)] max-w-none -translate-x-1/2 select-none"
            draggable={false}
          />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
      </div>
    </div>
  );
}
