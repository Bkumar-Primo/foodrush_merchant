import { BrandButton } from "@/components/common/BrandButton";
import type { OrderTab } from "@/types";

interface OrderDetailTabActionsProps {
  activeTab: OrderTab;
  prepRemainingSecs: number;
  prepRemainingMins: number;
  prepRemainingSecsRem: number;
  isReadyLoading: boolean;
  readyElapsedSecs: number;
  readyRemainingMins: number;
  readyRemainingSecsRem: number;
  handoverProgress: number;
  lateMins: number;
  lateSecsRem: number;
  formatCountdown: (mins: number, secs: number) => string;
  onReadyClick: () => Promise<void>;
  onNeedMoreTime: () => void;
}

export function OrderDetailTabActions({
  activeTab,
  prepRemainingSecs,
  prepRemainingMins,
  prepRemainingSecsRem,
  isReadyLoading,
  readyElapsedSecs,
  readyRemainingMins,
  readyRemainingSecsRem,
  handoverProgress,
  lateMins,
  lateSecsRem,
  formatCountdown,
  onReadyClick,
  onNeedMoreTime,
}: OrderDetailTabActionsProps): React.JSX.Element | null {
  if (activeTab === "preparing") {
    return prepRemainingSecs > 0 ? (
      <BrandButton
        variant="order"
        fullWidth
        onClick={onReadyClick}
        disabled={isReadyLoading}
        className="py-3 active:scale-[0.99]"
      >
        {isReadyLoading ? (
          <span className="flex h-4 items-center justify-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-pulse" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-pulse" />
            <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-pulse" />
          </span>
        ) : (
          `Order ready (${formatCountdown(prepRemainingMins, prepRemainingSecsRem)})`
        )}
      </BrandButton>
    ) : (
      <div className="grid grid-cols-5 items-center gap-3 self-end">
        <BrandButton
          variant="orderOutline"
          onClick={onNeedMoreTime}
          className="col-span-2 py-2.5 font-medium text-center"
        >
          Need more time
        </BrandButton>
        <BrandButton
          variant="danger"
          onClick={onReadyClick}
          disabled={isReadyLoading}
          className="col-span-3 py-2.5 font-medium text-center"
        >
          Order ready
        </BrandButton>
      </div>
    );
  }

  if (activeTab === "ready") {
    return (
      <div className="space-y-2.5 pt-1">
        {readyElapsedSecs <= 180 ? (
          <div>
            <div className="flex items-center justify-between text-[11px] font-medium text-zinc-550 dark:text-zinc-400 mb-1.5">
              <span>Handover food in</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {formatCountdown(readyRemainingMins, readyRemainingSecsRem)} mins
              </span>
            </div>
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-1000"
                style={{ width: `${handoverProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-red-600 dark:text-red-400 text-center animate-pulse leading-snug">
              Please handover food to delivery partner <br />( late by{" "}
              {formatCountdown(lateMins, lateSecsRem)} minutes )
            </p>
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 rounded-full w-full" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
