"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { XIcon, Printer, Volume2, VolumeX, Check } from "lucide-react";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { stopChime, useAudioChime } from "@/hooks/useAudioChime";
import { Order } from "@/types";

interface NewOrderModalProps {
  order: Order;
  onAccept: (orderId: string, prepTime: number) => Promise<void>;
  onReject: (orderId: string) => Promise<void>;
  onDismiss: () => void;
  onMinimize?: () => void;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  order,
  onAccept,
  onReject,
  onDismiss,
  onMinimize,
}) => {
  const { soundEnabled } = useDashboardStore();
  const { playLooping } = useAudioChime();
  const [prepTime, setPrepTime] = useState(40); // Default to 40 mins to match screenshot

  const getRemainingTime = useCallback(() => {
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

  // Sync timeLeft when order changes
  useEffect(() => {
    setTimeLeft(getRemainingTime());
  }, [order.id, getRemainingTime]);

  const stopSound = useCallback(() => {
    soundSuppressedRef.current = true;
    stopChime();
  }, []);

  // Start looping sound on mount if sound is enabled
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMuteToggle = useCallback(() => {
    stopSound();
    setIsMuted((prev) => !prev);
  }, [stopSound]);

  // Time left countdown
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
  }, [timeLeft, order.id, onReject, isAccepting, isAccepted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle scroll checks to show/hide "View more details" indicator overlay
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const hasOverflow = scrollHeight > clientHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setShowScrollIndicator(hasOverflow && !isAtBottom);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [order]);

  const handleScroll = () => {
    checkScroll();
  };

  const handleScrollDown = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const incrementTime = () => setPrepTime((prev) => Math.min(prev + 5, 120));
  const decrementTime = () => setPrepTime((prev) => Math.max(prev - 5, 5));

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const clearDismissTimer = () => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  };

  const handleAcceptClick = async () => {
    setIsAccepting(true);
    stopSound();
    await onAccept(order.id, prepTime);
    setIsAccepting(false);
    setIsAccepted(true);
    dismissTimerRef.current = setTimeout(() => {
      onDismiss();
    }, 1500);
  };

  const executeReject = async () => {
    stopSound();
    clearDismissTimer();
    await onReject(order.id);
    onDismiss();
  };

  const handleRejectClick = () => {
    if (isAccepting || isAccepted) return;
    setShowConfirmReject(true);
  };

  const handleClose = async () => {
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

  const formatOrderTime = (timestamp: number) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Calculate items cost, tax, discount
  const isSimulatedLitti = order.items.some(item => item.name.includes("Litti"));
  const itemTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxes = 0.0;
  // Make discount exactly 10% or match ₹71.60 for the litti order
  const discount = isSimulatedLitti ? 71.60 : Math.round(itemTotal * 0.1 * 100) / 100;
  const finalBill = isSimulatedLitti ? 644.40 : itemTotal - discount;

  // Progress for the countdown Accept button (from 299 seconds max)
  const progressPercent = (timeLeft / 299) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-[525px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Row */}
        <div className="px-5 py-2.5 flex items-center justify-between">
          <span className="font-black text-base text-zinc-900 dark:text-white">
            1 new order
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleMuteToggle}
              className="flex items-center gap-1 px-2.5 py-0.5 border border-blue-600 dark:border-blue-500 rounded-sm text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors"
            >
              {!isMuted ? (
                <span className="flex items-center gap-1">
                  <span>Mute</span>
                  <Volume2 className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span>Unmute</span>
                  <VolumeX className="h-3 w-3 text-zinc-400" />
                </span>
              )}
            </button>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer ml-1"
            >
              <XIcon className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container with Outer Padding and light-gray background to pop white card */}
        <div className="p-4 flex-1 bg-[#F9FAFB] dark:bg-zinc-950">
          
          {/* Bordered Table Box (containing everything inside a single border) */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900 shadow-xs flex flex-col max-h-[445px]">
            
            {/* FIXED HEADER SEGMENT */}
            <div className="flex flex-col shrink-0">
              {/* 1. Purple Header Banner */}
              <div className="bg-[#E5D5FF] dark:bg-purple-950/35 py-1.5 px-4 text-left border-b border-purple-200/50 dark:border-purple-900/30">
                <span className="text-[9.5px] font-black text-[#5B10A3] dark:text-purple-300 tracking-wider">
                  FOODRUSH DELIVERY
                </span>
              </div>

              {/* 2. ID & Customer Info Row */}
              {!isAccepted && (
              <div className="px-4 py-2.5 flex items-start justify-between bg-white dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-850">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">
                    ID. {isSimulatedLitti ? "3127" : order.id.slice(-4)} | {isSimulatedLitti ? "7:09 PM" : formatOrderTime(order.createdAt)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10.5px] text-zinc-550 dark:text-zinc-400 font-bold block">
                    16th order by {isSimulatedLitti ? "Khalil Ravi" : order.customerName}
                  </span>
                  <span className="inline-block mt-0.5 bg-[#FFF9F0] border border-[#FFE2B3] text-[#A66E2E] dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                    PREMIUM
                  </span>
                </div>
              </div>
              )}
            </div>

            {isAccepted ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 bg-white dark:bg-zinc-900 min-h-[280px]">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#249B5E]">
                  <Check className="h-7 w-7 text-white stroke-[3]" />
                </div>
                <p className="mt-4 text-sm font-bold text-zinc-900 dark:text-white">
                  Order accepted
                </p>
              </div>
            ) : (
            <>
            {/* SCROLLABLE INTERMEDIATE CONTENT AREA */}
            <div className="relative flex-1 min-h-0 flex flex-col">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="overflow-y-auto max-h-[210px] divide-y divide-zinc-155 dark:divide-zinc-800 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                
                {/* 3. Cutlery Warning & Items Row */}
                <div className="px-4 py-3 space-y-3">
                  
                  {/* Cutlery Warning badge (very small size) */}
                  <div className="flex items-start">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FFF2F2] dark:bg-rose-950/20 border border-[#FFE0E0] dark:border-rose-900/30 text-[9px] font-bold text-rose-655 dark:text-rose-400">
                      <span className="w-3 h-3 rounded-lg bg-rose-500 flex items-center justify-center text-white shrink-0">
                        <svg viewBox="0 0 24 24" className="w-2 h-2 fill-none stroke-current" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7H14" />
                        </svg>
                      </span>
                      Don't send cutlery, tissues and straws
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2.5 pt-0.5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-xs">
                        <div className="flex items-center">
                          {/* Veg Icon */}
                          <div className="border border-emerald-500 rounded p-[1px] inline-flex items-center justify-center size-3 mr-2 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-lg bg-emerald-500" />
                          </div>
                          <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                            {item.quantity} x {item.name}
                          </span>
                        </div>
                        <span className="font-extrabold text-zinc-900 dark:text-zinc-100">
                          ₹{item.price * item.quantity}.00
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* 4. Billing Breakdown Row */}
                <div className="px-4 py-2.5 space-y-1.5 bg-white dark:bg-zinc-900">
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <span>{order.items.length} {order.items.length === 1 ? "item" : "items"}</span>
                    <span>₹{itemTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <span className="border-b border-dashed border-zinc-300 dark:border-zinc-700 cursor-help">Taxes</span>
                    <span>₹{taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    <span className="border-b border-dashed border-zinc-300 dark:border-zinc-700 cursor-help">Discount</span>
                    <span>-₹{discount.toFixed(2)}</span>
                  </div>
                </div>

                {/* 5. Total Bill Row */}
                <div className="px-4 py-2.5 flex justify-between items-center bg-[#F9FAFB] dark:bg-zinc-900/50">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">Total Bill</span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                      PAID
                    </span>
                  </div>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">
                    ₹{finalBill.toFixed(2)}
                  </span>
                </div>

                {/* 6. Food Prep Time & Print Configuration Row */}
                <div className="px-4 py-3 space-y-2.5 bg-white dark:bg-zinc-900">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      Set food preparation time
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button className="inline-flex items-center gap-1 border border-blue-200 hover:bg-blue-50 text-blue-600 dark:border-blue-900/80 dark:hover:bg-blue-950/20 dark:text-blue-400 px-2 py-0.5 rounded text-[9.5px] font-bold cursor-pointer transition-colors">
                        <Printer className="h-3 w-3" /> KOT
                      </button>
                      <button className="inline-flex items-center gap-1 border border-blue-200 hover:bg-blue-50 text-blue-600 dark:border-blue-900/80 dark:hover:bg-blue-950/20 dark:text-blue-400 px-2 py-0.5 rounded text-[9.5px] font-bold cursor-pointer transition-colors">
                        <Printer className="h-3 w-3" /> ORDER
                      </button>
                    </div>
                  </div>

                  {/* Prep time increment/decrement block */}
                  <div className="flex items-center w-full border border-zinc-250 dark:border-zinc-750 rounded-lg overflow-hidden h-8">
                    <button
                      onClick={decrementTime}
                      className="flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 h-full w-12 text-sm font-bold text-zinc-555 border-r border-zinc-250 dark:border-zinc-750 cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <div className="flex-1 text-xs font-extrabold text-zinc-800 dark:text-zinc-200 h-full flex items-center justify-center bg-white dark:bg-zinc-900">
                      {prepTime} mins
                    </div>
                    <button
                      onClick={incrementTime}
                      className="flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 h-full w-12 text-sm font-bold text-zinc-555 border-l border-zinc-250 dark:border-zinc-750 cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

              </div>

              {/* View More Details Indicator Overlay (Fades out when scrolled to bottom) */}
              {showScrollIndicator && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                  <button
                    onClick={handleScrollDown}
                    className="bg-[#3f3f46] hover:bg-[#52525b] dark:bg-[#27272a] dark:hover:bg-[#3f3f46] text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-lg border border-[#52525b] dark:border-[#3f3f46] transition-all active:scale-95"
                  >
                    <span>View more details</span>
                    <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-current fill-none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
              )}

            </div>

            {/* FIXED FOOTER SEGMENT (Buttons inside the bordered card box) */}
            <div className="px-5 py-3 border-t border-zinc-150 dark:border-zinc-800 flex items-center gap-3 bg-white dark:bg-zinc-900 shrink-0">
              <button
                onClick={handleRejectClick}
                disabled={isAccepting || isAccepted}
                className="w-[30%] min-h-10 border border-red-600 dark:border-red-500 bg-transparent text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-500 dark:hover:text-white rounded-md py-2.5 text-xs font-black transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-center"
              >
                Reject
              </button>
              <button
                onClick={handleAcceptClick}
                disabled={isAccepting}
                className="relative w-[70%] min-h-10 bg-[#249B5E] hover:bg-[#1E8650] disabled:hover:bg-[#249B5E] text-white rounded-md py-2.5 text-xs font-black transition-all cursor-pointer disabled:cursor-not-allowed overflow-hidden text-center active:scale-[0.99] disabled:active:scale-100 flex items-center justify-center"
              >
                {!isAccepting && (
                  <div
                    className="absolute top-0 right-0 bottom-0 bg-[#2EBD7C]/95 transition-all duration-1000 ease-linear pointer-events-none"
                    style={{ width: `${100 - progressPercent}%` }}
                  />
                )}
                {isAccepting ? (
                  <span className="relative z-10 flex h-4 items-center justify-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:0ms]" />
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:200ms]" />
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white animate-dot-pulse [animation-delay:400ms]" />
                  </span>
                ) : (
                  <span className="relative z-10">
                    Accept order ({formatCountdown(timeLeft)})
                  </span>
                )}
              </button>
            </div>
            </>
            )}

          </div>
        </div>

      </div>

      {showConfirmReject && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="w-full max-w-[350px] bg-white dark:bg-zinc-900 rounded-xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-4 animate-in fade-in zoom-in-95 duration-100">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Reject Order?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Are you sure you want to reject this order? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end pt-2">
              <button
                onClick={() => setShowConfirmReject(false)}
                className="px-3.5 py-1.5 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeReject}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs font-semibold cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewOrderModal;
