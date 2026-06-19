"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Clock,
  Printer,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  Utensils,
  PhoneOutgoing,
  Drumstick,
  LeafyGreen,
  PhoneCall,
  Motorbike,
} from "lucide-react";
import { Order } from "@/types";
import { updateOrderStatus } from "@/lib/db/firebase";
import NeedMoreTimeModal from "./NeedMoreTimeModal";

// Mock rider names
const MOCK_RIDERS = [
  { name: "Chandan", avatar: "/images/avatar.png" },
  { name: "Vishwanatha", avatar: "/images/avatar.png" },
  { name: "Rahul", avatar: "/images/avatar.png" },
  { name: "Suresh", avatar: "/images/avatar.png" },
  { name: "Amit", avatar: "/images/avatar.png" },
];

function getSimulatedRider(orderId: string) {
  const hash = orderId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rider = MOCK_RIDERS[hash % MOCK_RIDERS.length];
  const otp = 1000 + (hash % 9000);
  return { ...rider, otp };
}

interface OrderDetailViewProps {
  order: Order;
  activeTab: "preparing" | "ready" | "picked_up";
  onReady: (id: string) => void;
  onDispatch: (id: string) => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  activeTab,
  onReady,
  onDispatch,
}) => {
  const [, setTick] = useState(0);
  const [isReadyLoading, setIsReadyLoading] = useState(false);
  const [showNeedMoreTime, setShowNeedMoreTime] = useState(false);
  const [uniformFeedback, setUniformFeedback] = useState<"yes" | "no" | null>(
    null,
  );

  // Tick every second for timers
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const rider = useMemo(() => getSimulatedRider(order.id), [order.id]);

  // Placed Time Calculation
  const elapsedMs = Date.now() - order.createdAt;
  const elapsedMins = Math.floor(elapsedMs / 60000);
  const placedTimeStr = new Date(order.createdAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Dynamic dietary badge determination
  const orderDietType = useMemo(() => {
    const items = order.items || [];
    const hasVeg = items.some((item) => {
      const name = item.name.toLowerCase();
      return (
        !name.includes("chicken") &&
        !name.includes("omelette") &&
        !name.includes("egg") &&
        !name.includes("mutton") &&
        !name.includes("fish") &&
        !name.includes("kebab")
      );
    });
    const hasNonVeg = items.some((item) => {
      const name = item.name.toLowerCase();
      return (
        name.includes("chicken") ||
        name.includes("omelette") ||
        name.includes("egg") ||
        name.includes("mutton") ||
        name.includes("fish") ||
        name.includes("kebab")
      );
    });

    if (hasVeg && hasNonVeg) return "mixed";
    if (hasNonVeg) return "non-veg";
    return "veg";
  }, [order.items]);

  // Preparing Tab Timers
  const prepTimeMins = (order as any).prepTime || 40;
  const prepStartedAt = (order as any).prepStartedAt || order.createdAt;
  const prepRemainingSecs = Math.max(
    0,
    Math.ceil(prepTimeMins * 60 - (Date.now() - prepStartedAt) / 1000),
  );
  const prepRemainingMins = Math.floor(prepRemainingSecs / 60);
  const prepRemainingSecsRem = prepRemainingSecs % 60;

  // Ready Tab Handover Timer
  const readyElapsedSecs = Math.floor((Date.now() - order.updatedAt) / 1000);
  const readyRemainingSecs = Math.max(0, 180 - readyElapsedSecs);
  const readyRemainingMins = Math.floor(readyRemainingSecs / 60);
  const readyRemainingSecsRem = readyRemainingSecs % 60;
  const handoverProgress = Math.min(100, (readyElapsedSecs / 180) * 100);

  // Late handover calculation
  const lateSecs = Math.max(0, readyElapsedSecs - 180);
  const lateMins = Math.floor(lateSecs / 60);
  const lateSecsRem = lateSecs % 60;

  const elapsedSecs = Math.floor(elapsedMs / 1000);
  const isRiderArrived = elapsedSecs > 15;

  const handleReadyClick = async () => {
    setIsReadyLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onReady(order.id);
    setIsReadyLoading(false);
  };

  const handleExtraTimeSubmit = async (extraTime: number) => {
    await updateOrderStatus(order.id, "preparing", {
      prepTime: extraTime,
      prepStartedAt: Date.now(),
    });
  };

  const formatCountdown = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const billTotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount = Math.round(billTotal * 0.1 * 100) / 100;
  const finalBill = billTotal - discount;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 overflow-hidden shadow-xs">
      <div className="grid grid-cols-[320px_1fr_320px] min-h-[250px]">
        <div className="flex">
          <div className="flex-1 my-3">
            <div className="my-1 bg-[#D9CAF8] dark:bg-purple-950/20 flex items-center mx-3 rounded-[3px]">
              <span className="text-[10px] font-semibold p-0.5 ml-1.5 text-[#765FAC]">
                FOODRUSH - DELIVERY
              </span>
            </div>

            <div className="px-4 pt-2 flex flex-col flex-1 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    ID: <span className="font-bold">{order.id.slice(-4)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1.5 border-b pb-3">
                  <button className="flex items-center gap-1.5 px-2 py-0.5 border border-blue-500 rounded text-blue-600 text-[10px] font-bold hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors">
                    <Printer className="h-3 w-3" /> KOT
                  </button>
                  <button className="flex items-center gap-1.5 px-2 py-0.5 border border-blue-500 rounded text-blue-600 text-[10px] font-bold hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors">
                    <Printer className="h-3 w-3" /> ORDER
                  </button>
                </div>
              </div>

              <div className="space-y-1 border-b pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-normal text-zinc-800 dark:text-white">
                    {order.customerName}
                  </span>
                  <button className="flex items-center gap-1 text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer">
                    <PhoneOutgoing className="h-3 w-3" /> Call
                  </button>
                </div>
                <p className="text-[10px] font-normal">10th order</p>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-400 font-normal flex items-start gap-0.5 mt-1 leading-relaxed">
                  TC Palya, KR Puram (1 km, 7 mins away)
                </p>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11.5px] font-normal text-zinc-500 dark:text-zinc-400">
                  Placed:{" "}
                  <span className="font-medium text-[12px] text-zinc-800 dark:text-zinc-200">
                    {elapsedMins < 60
                      ? `${elapsedMins} mins ago`
                      : placedTimeStr}
                  </span>
                </span>
                <button className="flex items-center gap-1 text-[11.5px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer">
                  <Clock className="h-3 w-3" /> Timeline
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex">
          <div className="flex-1 my-3 border-r-2 border-l-2 border-dotted border-zinc-200 dark:border-zinc-800">
            <div className="flex items-start mx-3 my-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-[#FFF2F2] dark:bg-rose-950/20 border border-[#FFE0E0] dark:border-rose-900/30 text-[10px] font-bold text-[#E8604C] dark:text-rose-400 leading-none">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
                  <Utensils className="h-3 w-3" />
                </span>
                Don&apos;t send cutlery, tissues and straws
              </span>
            </div>
            <div className="p-4 flex-1">
              <div className="space-y-2.5 mb-4">
                {order.items.map((item, idx) => {
                  const isVegItem =
                    !item.name.toLowerCase().includes("chicken") &&
                    !item.name.toLowerCase().includes("omelette") &&
                    !item.name.toLowerCase().includes("egg");
                  return (
                    <div
                      key={idx}
                      className="flex items-start justify-between text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`mt-0.5 border ${isVegItem ? "border-green-600" : "border-red-600"} rounded p-px inline-flex items-center justify-center size-3.5 shrink-0`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${isVegItem ? "bg-green-600" : "bg-red-600"}`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {item.quantity} x{" "}
                            <span className="underline decoration-dotted underline-offset-4">
                              {item.name}
                            </span>
                          </span>
                        </div>
                      </div>
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-b pb-3 border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-zinc-900 dark:text-white underline decoration-dotted underline-offset-4">
                    Total Bill
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-250/50 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider">
                    PAID
                  </span>
                </div>
                <span className="text-sm font-medium text-zinc-950 dark:text-white">
                  ₹{finalBill.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-center mt-1 pt-1">
                {orderDietType === "veg" && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5">
                    <LeafyGreen className="h-4 w-4 text-green-600" />
                    <span className="text-[12px] font-medium text-green-600 uppercase tracking-wider">
                      VEG ONLY ORDER
                    </span>
                  </div>
                )}
                {orderDietType === "non-veg" && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5">
                    <Drumstick className="h-4 w-4 text-red-600" />
                    <span className="text-[12px] font-medium text-red-600 uppercase tracking-wider">
                      NON-VEG ONLY ORDER
                    </span>
                  </div>
                )}
                {orderDietType === "mixed" && (
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 ">
                    <span className="text-[12px] font-medium text-amber-600 uppercase tracking-wider">
                      VEG/NON-VEG ORDER
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 pt-3">
              {activeTab === "preparing" && (
                <>
                  {prepRemainingSecs > 0 ? (
                    <button
                      onClick={handleReadyClick}
                      disabled={isReadyLoading}
                      className="w-full bg-[#185adb] hover:bg-[#1146ad] disabled:hover:bg-[#185adb] text-white rounded-md py-3 text-xs font-medium transition-all cursor-pointer flex items-center justify-center select-none active:scale-[0.99]"
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
                    </button>
                  ) : (
                    <div className="grid grid-cols-5 items-center gap-3 self-end">
                      <button
                        onClick={() => setShowNeedMoreTime(true)}
                        className=" col-span-2 py-2.5 rounded-md border border-[#185adb] bg-white text-[#185adb] hover:bg-blue-50/50 text-xs font-black cursor-pointer transition-colors text-center select-none"
                      >
                        Need more time
                      </button>
                      <button
                        onClick={handleReadyClick}
                        disabled={isReadyLoading}
                        className=" col-span-3 py-2.5 rounded-md bg-[#E1656D] hover:bg-[#d75660] text-white text-xs font-black cursor-pointer transition-colors text-center select-none"
                      >
                        Order ready
                      </button>
                    </div>
                  )}
                </>
              )}

              {activeTab === "ready" && (
                <div className="space-y-2.5 pt-1">
                  {readyElapsedSecs <= 180 ? (
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-zinc-550 dark:text-zinc-400 mb-1.5">
                        <span>Handover food in</span>
                        <span className="font-extrabold text-zinc-700 dark:text-zinc-300">
                          {formatCountdown(
                            readyRemainingMins,
                            readyRemainingSecsRem,
                          )}{" "}
                          mins
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
                      <p className="text-[11px] font-extrabold text-red-600 dark:text-red-400 text-center animate-pulse leading-snug">
                        Please handover food to delivery partner <br />( late by{" "}
                        {formatCountdown(lateMins, lateSecsRem)} minutes )
                      </p>
                      <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full w-full" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col p-4 gap-5">
          {activeTab === "preparing" && (
            <div className="">
              {isRiderArrived ? (
                <div className="border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-3 bg-white dark:bg-zinc-950">
                  <div className="flex items-start gap-3">
                    <img
                      src={rider.avatar}
                      alt={rider.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                    />
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs font-normal text-zinc-900 dark:text-white truncate">
                        {rider.name} has arrived
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-blue-600 flex items-center gap-1">
                          <PhoneCall className="h-3 w-3 " />
                          <button className="text-[10px] font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                            Call
                          </button>
                        </div>
                        <span className="text-[10px] text-zinc-300">|</span>
                        <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                          OTP:{" "}
                          <span className="text-zinc-400 dark:text-zinc-600">
                            {rider.otp}
                          </span>
                        </span>
                      </div>
                      <button className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Track location
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-3.5 bg-white flex items-center gap-2.5">
                  <Motorbike className="h-5 w-5 text-zinc-700 shrink-0" />
                  <span className="text-[11px] font-bold text-zinc-600 leading-snug">
                    4 riders nearby, assigning one soon
                  </span>
                </div>
              )}
            </div>
          )}

          {activeTab === "ready" && (
            <div className="">
              <div className="border border-zinc-200/70 dark:border-zinc-800/80 rounded-xl p-3 bg-white dark:bg-zinc-950">
                <div className="flex items-center gap-3">
                  <img
                    src={rider.avatar}
                    alt={rider.name}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-normal text-zinc-900 dark:text-white truncate">
                      {rider.name} has arrived
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-blue-600 flex items-center gap-1">
                        <PhoneCall className="h-3 w-3 " />
                        <button className="text-[10px] font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                          Call
                        </button>
                      </div>
                      <span className="text-[10px] text-zinc-300">|</span>
                      <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">
                        OTP:{" "}
                        <span className="text-zinc-400 dark:text-zinc-600">
                          {rider.otp}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onDispatch(order.id)}
                  className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1.5 text-[10.5px] font-black cursor-pointer transition-colors shadow-xs text-center"
                >
                  Handover Food
                </button>
              </div>
            </div>
          )}

          {activeTab === "picked_up" && (
            <div className="border rounded-lg space-y-4">
              <div className="border-b p-3 bg-[#F5FBFC] first:rounded-t-lg  dark:border-green-900/30 dark:bg-green-950/15 flex items-center justify-between">
                <div className="space-y-0.5 ">
                  <p className="text-xs font-medium text-zinc-900 dark:text-white">
                    Order was prepared in time
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
                    Timely delivery to the customer
                  </p>
                </div>
                <CheckCircle2 className="h-7 w-7 text-green-600 dark:text-green-500 shrink-0" />
              </div>

              <div className="flex items-center gap-3 px-3">
                <img
                  src={rider.avatar}
                  alt={rider.name}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-zinc-900 dark:text-white leading-tight">
                    {rider.name} has picked up your order
                  </p>
                  <div className="text-blue-600 flex items-center gap-1">
                    <PhoneCall className="h-3 w-3 " />
                    <button className="text-[10px] font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                      Call
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 px-3 pb-3 border-b">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-550 dark:text-zinc-400">
                  <span>Delivering in 12 mins</span>
                </div>
                <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full w-[40%]" />
                </div>
              </div>
              <div className="px-3 pb-3">
                <p className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Was {rider.name} in uniform?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUniformFeedback("no")}
                    className={`flex-1 py-1.5 rounded-md border text-[10px] font-medium cursor-pointer transition-colors text-center ${
                      uniformFeedback === "no"
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-red-300 text-red-500 hover:bg-red-50/50"
                    }`}
                  >
                    No
                  </button>
                  <button
                    onClick={() => setUniformFeedback("yes")}
                    className={`flex-1 py-1.5 rounded-md border text-[10px] font-medium cursor-pointer transition-colors text-center ${
                      uniformFeedback === "yes"
                        ? "bg-green-600 border-green-600 text-white"
                        : "border-green-300 text-green-600 hover:bg-green-50/50"
                    }`}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 items-end">
            <button className="w-fit flex items-center gap-1.5 py-1.5 px-2 rounded-sm text-[#185adb] border border-[#185adb] text-[10.5px] font-medium hover:bg-blue-50/50 cursor-pointer transition-colors bg-white">
              <MessageSquare className="h-3.5 w-3.5" /> Live order chat support
            </button>
            <button className="w-fit flex items-center gap-1.5 py-1.5 px-2 rounded-sm text-[#185adb] border border-[#185adb] text-[10.5px] font-medium hover:bg-blue-50/50 cursor-pointer transition-colors bg-white">
              <HelpCircle className="h-3.5 w-3.5" /> Order help
            </button>
          </div>
        </div>
      </div>

      {showNeedMoreTime && (
        <NeedMoreTimeModal
          onClose={() => setShowNeedMoreTime(false)}
          onSubmit={handleExtraTimeSubmit}
        />
      )}
    </div>
  );
};

export default OrderDetailView;
