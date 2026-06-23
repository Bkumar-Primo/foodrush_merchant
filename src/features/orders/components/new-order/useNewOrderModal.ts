import { useCallback, useEffect, useRef, useState } from "react";
import { stopChime, useAudioChime } from "@/hooks/useAudioChime";
import { useDashboardStore } from "@/stores/useDashboardStore";
import type { Order } from "@/types";
import type { NewOrderModalProps } from "./types";

interface UseNewOrderModalParams {
  order: Order;
  onAccept: NewOrderModalProps["onAccept"];
  onReject: NewOrderModalProps["onReject"];
  onDismiss: NewOrderModalProps["onDismiss"];
  onMinimize?: NewOrderModalProps["onMinimize"];
}

export function useNewOrderModal({
  order,
  onAccept,
  onReject,
  onDismiss,
  onMinimize,
}: UseNewOrderModalParams) {
  const { soundEnabled } = useDashboardStore();
  const { playLooping } = useAudioChime();
  const [prepTime, setPrepTime] = useState(40);

  const getRemainingTime = useCallback((): number => {
    const elapsedSecs = Math.floor((Date.now() - order.createdAt) / 1000);
    return Math.max(0, 300 - elapsedSecs);
  }, [order.createdAt]);

  const [timeLeft, setTimeLeft] = useState(getRemainingTime);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfirmReject, setShowConfirmReject] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const soundSuppressedRef = useRef(false);

  const clearDismissTimer = useCallback((): void => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const stopSound = useCallback((): void => {
    soundSuppressedRef.current = true;
    stopChime();
  }, []);

  const executeReject = useCallback(async (): Promise<void> => {
    stopSound();
    clearDismissTimer();
    await onReject(order.id);
    onDismiss();
  }, [stopSound, onReject, order.id, onDismiss, clearDismissTimer]);

  const [prevOrderId, setPrevOrderId] = useState(order.id);
  if (order.id !== prevOrderId) {
    setPrevOrderId(order.id);
    setTimeLeft(getRemainingTime());
  }

  useEffect(() => {
    if (soundEnabled && !isMuted && !soundSuppressedRef.current) {
      playLooping();
    }
    return () => {
      stopChime();
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, [soundEnabled, isMuted, playLooping]);

  const handleMuteToggle = useCallback((): void => {
    stopSound();
    setIsMuted((prev) => !prev);
  }, [stopSound]);

  useEffect(() => {
    if (isAccepting || isAccepted) return;

    if (timeLeft <= 0) {
      executeReject();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAccepting, isAccepted, executeReject]);

  const checkScroll = useCallback((): void => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasOverflow = scrollHeight > clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollIndicator(hasOverflow && !isAtBottom);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [checkScroll]);

  const handleScroll = (): void => {
    checkScroll();
  };

  const handleScrollDown = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const incrementTime = (): void => setPrepTime((prev) => Math.min(prev + 5, 120));
  const decrementTime = (): void => setPrepTime((prev) => Math.max(prev - 5, 5));

  const handleAcceptClick = async (): Promise<void> => {
    setIsAccepting(true);
    stopSound();
    await onAccept(order.id, prepTime);
    setIsAccepting(false);
    setIsAccepted(true);
    dismissTimerRef.current = setTimeout(() => {
      onDismiss();
    }, 1500);
  };

  const handleRejectClick = (): void => {
    if (isAccepting || isAccepted) return;
    setShowConfirmReject(true);
  };

  const handleClose = async (): Promise<void> => {
    stopSound();
    if (isAccepted || isAccepting) {
      onDismiss();
      return;
    }
    if (onMinimize) {
      onMinimize();
    } else {
      onDismiss();
    }
  };

  const progressPercent = (timeLeft / 299) * 100;

  return {
    prepTime,
    timeLeft,
    isAccepting,
    isAccepted,
    showScrollIndicator,
    isMuted,
    showConfirmReject,
    scrollRef,
    progressPercent,
    incrementTime,
    decrementTime,
    handleMuteToggle,
    handleScroll,
    handleScrollDown,
    handleAcceptClick,
    handleRejectClick,
    handleClose,
    executeReject,
    setShowConfirmReject,
  };
}
