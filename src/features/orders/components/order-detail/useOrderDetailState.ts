"use client";

import { useMemo, useState } from "react";
import { useNow } from "@/hooks/useNow";
import { updateOrderStatus } from "@/lib/db";
import type { Order } from "@/types";
import {
  calculateOrderBill,
  formatCountdown,
  getOrderDietType,
  getPlacedTimeDisplay,
  getPrepTimers,
  getReadyTimers,
  getSimulatedRider,
  type OrderBill,
  type OrderDietType,
  type SimulatedRider,
} from "./orderDetailUtils";

export type UniformFeedback = "yes" | "no" | null;

interface UseOrderDetailStateParams {
  order: Order;
  onReady: (id: string) => void | Promise<void>;
}

export interface UseOrderDetailStateResult {
  rider: SimulatedRider | null;
  orderDietType: OrderDietType;
  bill: OrderBill;
  placedTimeDisplay: string;
  prepRemainingSecs: number;
  prepRemainingMins: number;
  prepRemainingSecsRem: number;
  readyElapsedSecs: number;
  readyRemainingMins: number;
  readyRemainingSecsRem: number;
  handoverProgress: number;
  lateMins: number;
  lateSecsRem: number;
  isReadyLoading: boolean;
  showNeedMoreTime: boolean;
  setShowNeedMoreTime: (show: boolean) => void;
  uniformFeedback: UniformFeedback;
  setUniformFeedback: (feedback: UniformFeedback) => void;
  handleReadyClick: () => Promise<void>;
  handleExtraTimeSubmit: (extraTime: number) => Promise<void>;
  formatCountdown: (mins: number, secs: number) => string;
}

export function useOrderDetailState({
  order,
  onReady,
}: UseOrderDetailStateParams): UseOrderDetailStateResult {
  const now = useNow();
  const [isReadyLoading, setIsReadyLoading] = useState(false);
  const [showNeedMoreTime, setShowNeedMoreTime] = useState(false);
  const [uniformFeedback, setUniformFeedback] = useState<UniformFeedback>(null);

  const rider = useMemo(() => getSimulatedRider(order), [order]);
  const orderDietType = useMemo(() => getOrderDietType(order.items), [order.items]);
  const bill = useMemo(() => calculateOrderBill(order.items), [order.items]);
  const placedTimeDisplay = getPlacedTimeDisplay(now, order.createdAt);

  const prepTimers = getPrepTimers(now, order);
  const readyTimers = getReadyTimers(now, order.updatedAt);

  const handleReadyClick = async (): Promise<void> => {
    setIsReadyLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    await onReady(order.id);
    setIsReadyLoading(false);
  };

  const handleExtraTimeSubmit = async (extraTime: number): Promise<void> => {
    await updateOrderStatus(order.id, "preparing", {
      prepTime: extraTime,
      prepStartedAt: Date.now(),
    });
  };

  return {
    rider,
    orderDietType,
    bill,
    placedTimeDisplay,
    prepRemainingSecs: prepTimers.remainingSecs,
    prepRemainingMins: prepTimers.remainingMins,
    prepRemainingSecsRem: prepTimers.remainingSecsRem,
    readyElapsedSecs: readyTimers.elapsedSecs,
    readyRemainingMins: readyTimers.remainingMins,
    readyRemainingSecsRem: readyTimers.remainingSecsRem,
    handoverProgress: readyTimers.handoverProgress,
    lateMins: readyTimers.lateMins,
    lateSecsRem: readyTimers.lateSecsRem,
    isReadyLoading,
    showNeedMoreTime,
    setShowNeedMoreTime,
    uniformFeedback,
    setUniformFeedback,
    handleReadyClick,
    handleExtraTimeSubmit,
    formatCountdown,
  };
}
