"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Database,
  Flame,
  Globe,
  Loader2,
  Minus,
  Phone,
  Plus,
  RefreshCw,
  Server,
  ShoppingBag,
  Sliders,
  Smartphone,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SIMULATE_ORDER_SCENARIOS } from "@/components/dashboard/merchant-dashboard/simulateOrderScenarios";
import type { Order, OrderStatus } from "@/types";

const MENU_ITEMS_PRESETS = [
  { id: "item_litti_1", name: "Litti Chokha with Ghee", price: 139, emoji: "🫓", type: "veg" },
  { id: "item_litti_2", name: "Crispy Tawa Fried Litti", price: 179, emoji: "🥟", type: "veg" },
  { id: "item_vp_1", name: "Classic Mumbai Vada Pav", price: 50, emoji: "🍔", type: "veg" },
  {
    id: "item_ts_1",
    name: "Bihari Chicken Curry with Phulka",
    price: 249,
    emoji: "🍛",
    type: "non-veg",
  },
];

const getAvatarStyle = (name: string) => {
  const char = name.charAt(0).toUpperCase();
  const code = char.charCodeAt(0);
  const styles = [
    { bg: "bg-blue-50 border-blue-100 text-blue-700", dot: "bg-blue-500" },
    { bg: "bg-indigo-50 border-indigo-100 text-indigo-700", dot: "bg-indigo-500" },
    { bg: "bg-violet-50 border-violet-100 text-violet-700", dot: "bg-violet-500" },
    { bg: "bg-emerald-50 border-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
    { bg: "bg-amber-50 border-amber-100 text-amber-700", dot: "bg-amber-500" },
    { bg: "bg-rose-50 border-rose-100 text-rose-700", dot: "bg-rose-500" },
  ];
  return styles[code % styles.length];
};

export function SimulatorControl() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"connected" | "connecting" | "error">("connecting");
  const [activeTab, setActiveTab] = useState<"simulate" | "custom" | "feed">("simulate");
  const [serverIp, setServerIp] = useState<string>("localhost");
  const [serverPort, setServerPort] = useState<number>(3000);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Custom builder states
  const [customName, setCustomName] = useState("");
  const [customPhone, setCustomPhone] = useState("");
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});

  // Fetch orders and server info
  useEffect(() => {
    void refreshTrigger;
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
          setStatus("connected");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setStatus("error");
      }
    };

    fetch("/api/server-info")
      .then((res) => res.json())
      .then((data) => {
        if (data.localIp) {
          setServerIp(data.localIp);
          setServerPort(data.port || 3000);
        }
      })
      .catch((err) => console.error("Error loading server info:", err));

    fetchOrders();
    const interval = setInterval(fetchOrders, 1500);
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const triggerSimulation = async (scenarioIndex: number, isUrgent = false) => {
    const key = `${scenarioIndex}-${isUrgent ? "urgent" : "standard"}`;
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const scenario = SIMULATE_ORDER_SCENARIOS[scenarioIndex % SIMULATE_ORDER_SCENARIOS.length];
      const pastSeconds = isUrgent ? 250 : 0;
      const timestamp = Date.now() - pastSeconds * 1000;
      const id = (6300000000 + Math.floor(Math.random() * 100000000)).toString();

      const newOrder: Order = {
        ...scenario,
        id,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        setOrders((prev) => [newOrder, ...prev]);
        setExpandedOrderId(id);
        if (typeof window !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    } catch (err) {
      console.error("Failed to inject simulation:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const injectCustomOrder = async () => {
    const key = "custom-inject";
    setLoading((prev) => ({ ...prev, [key]: true }));

    try {
      const itemsList = MENU_ITEMS_PRESETS.filter(
        (item) => (selectedQuantities[item.id] || 0) > 0,
      ).map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: selectedQuantities[item.id] || 0,
      }));

      if (itemsList.length === 0) {
        alert("Please add at least one item to the order.");
        return;
      }

      const totalAmount = itemsList.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
      const id = (6300000000 + Math.floor(Math.random() * 100000000)).toString();
      const timestamp = Date.now();

      const newOrder: Order = {
        id,
        customerId: `cust_${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: customName.trim() || "Guest Customer",
        customerPhone: customPhone.trim() || "+91 99999 88888",
        items: itemsList,
        totalAmount,
        status: "placed",
        createdAt: timestamp,
        updatedAt: timestamp,
        deliveryCoords: [12.9715987, 77.5945627],
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (res.ok) {
        setOrders((prev) => [newOrder, ...prev]);
        setCustomName("");
        setCustomPhone("");
        setSelectedQuantities({});
        setExpandedOrderId(id);
        setActiveTab("feed");
        if (typeof window !== "undefined" && navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    } catch (err) {
      console.error("Failed to inject custom order:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const advanceOrderStatus = async (order: Order) => {
    const key = `progress-${order.id}`;
    setLoading((prev) => ({ ...prev, [key]: true }));

    let nextStatus: OrderStatus = "placed";
    const extraFields: Partial<Pick<Order, "prepTime" | "prepStartedAt">> = {};

    switch (order.status) {
      case "placed":
        nextStatus = "preparing";
        extraFields.prepTime = 15;
        extraFields.prepStartedAt = Date.now();
        break;
      case "preparing":
        nextStatus = "ready_for_pickup";
        break;
      case "ready_for_pickup":
        nextStatus = "dispatched";
        break;
      case "dispatched":
        nextStatus = "delivered";
        break;
      default:
        return;
    }

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, ...extraFields }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === order.id
              ? { ...o, status: nextStatus, updatedAt: Date.now(), ...extraFields }
              : o,
          ),
        );
        if (typeof window !== "undefined" && navigator.vibrate) {
          navigator.vibrate(80);
        }
      }
    } catch (err) {
      console.error("Failed to update status from phone:", err);
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return {
          badge: "bg-amber-50 text-amber-700 border-amber-200/50",
          bar: "bg-amber-500",
          dot: "bg-amber-500 shadow-[0_0_6px_#f59e0b]",
        };
      case "preparing":
        return {
          badge: "bg-blue-50 text-blue-700 border-blue-200/50",
          bar: "bg-blue-500",
          dot: "bg-blue-500 shadow-[0_0_6px_#3b82f6]",
        };
      case "ready_for_pickup":
        return {
          badge: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
          bar: "bg-emerald-500",
          dot: "bg-emerald-500 shadow-[0_0_6px_#10b981]",
        };
      case "dispatched":
        return {
          badge: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
          bar: "bg-indigo-500",
          dot: "bg-indigo-500 shadow-[0_0_6px_#6366f1]",
        };
      case "delivered":
        return {
          badge: "bg-zinc-50 text-zinc-500 border-zinc-200/50",
          bar: "bg-zinc-400",
          dot: "bg-zinc-400",
        };
      case "rejected":
        return {
          badge: "bg-rose-50 text-rose-700 border-rose-200/50",
          bar: "bg-rose-500",
          dot: "bg-rose-500 shadow-[0_0_6px_#ef4444]",
        };
      default:
        return {
          badge: "bg-zinc-100 text-zinc-650 border-zinc-200",
          bar: "bg-zinc-400",
          dot: "bg-zinc-450",
        };
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return "Placed";
      case "preparing":
        return "Preparing";
      case "ready_for_pickup":
        return "Ready";
      case "dispatched":
        return "Transit";
      case "delivered":
        return "Delivered";
      case "rejected":
        return "Rejected";
      default:
        return status;
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setSelectedQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  // Stats calculation
  const totalSimulated = orders.filter((o) => o.id.startsWith("63")).length;
  const activeCount = orders.filter((o) =>
    ["placed", "preparing", "ready_for_pickup", "dispatched"].includes(o.status),
  ).length;
  const successRate =
    totalSimulated > 0
      ? Math.round(
          (orders.filter((o) => o.id.startsWith("63") && o.status === "delivered").length /
            totalSimulated) *
            100,
        )
      : 100;

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-600 flex flex-col font-sans select-none antialiased relative">
      {/* Stripe-style Glass Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/50 bg-white/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 shadow-sm border border-zinc-800">
            <Smartphone className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-1">
              FoodRush <span className="text-blue-600 font-medium">Control Console</span>
            </h1>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
              http://{serverIp}:{serverPort}
            </p>
          </div>
        </div>

        {/* Dynamic Server Status Pill */}
        {status === "connected" && (
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 tracking-wide shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981] animate-pulse" />
            <span>Online</span>
          </div>
        )}
        {status === "connecting" && (
          <div className="flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 tracking-wide shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b] animate-pulse" />
            <span>Connecting</span>
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-1.5 rounded-full border border-rose-100 bg-rose-50 px-2.5 py-0.5 text-[10px] font-semibold text-rose-700 tracking-wide shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_#ef4444] animate-pulse" />
            <span>Error</span>
          </div>
        )}
      </header>

      {/* Tab Switcher */}
      <div className="border-b border-zinc-200/50 bg-white px-6 py-3 shrink-0 z-10">
        <div className="flex bg-zinc-100/80 p-0.5 rounded-lg relative max-w-md mx-auto border border-zinc-200/50">
          {[
            { id: "simulate", label: "Presets", icon: Sparkles },
            { id: "custom", label: "Customizer", icon: Sliders },
            { id: "feed", label: "Live logs", icon: Activity },
          ].map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as "simulate" | "custom" | "feed")}
                className={`flex-grow flex items-center justify-center gap-1.5 py-2 text-center text-xs font-semibold relative transition-colors duration-300 z-10 cursor-pointer ${
                  isActive ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="lightThemeTabSlider"
                    className="absolute inset-0 rounded-md bg-white border border-zinc-200/60 shadow-sm z-[-1]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <TabIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-grow overflow-y-auto px-6 py-6 space-y-6 z-10 max-w-4xl w-full mx-auto">
        {activeTab === "simulate" ? (
          <>
            {/* Bento Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Mock Orders",
                  val: totalSimulated,
                  icon: Database,
                  color: "text-zinc-500",
                  dotColor: "bg-zinc-400",
                  trend: { val: "+14.2%", positive: true },
                },
                {
                  label: "Active Live Orders",
                  val: activeCount,
                  icon: Activity,
                  color: "text-blue-600",
                  dotColor: "bg-blue-500",
                  trend: { val: "+5.1%", positive: true },
                },
                {
                  label: "Success Rate",
                  val: `${successRate}%`,
                  icon: TrendingUp,
                  color: "text-emerald-600",
                  dotColor: "bg-emerald-500",
                  trend: { val: "0.0%", positive: true },
                },
              ].map((card) => (
                <motion.div
                  key={card.label}
                  whileHover={{ y: -1, transition: { duration: 0.2 } }}
                  className="rounded-xl border border-zinc-200 bg-white p-4.5 flex flex-col justify-between shadow-xs hover:border-zinc-300 transition-all duration-200 relative overflow-hidden"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <card.icon className={`h-3.5 w-3.5 ${card.color}`} aria-hidden="true" />
                      {card.label}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${card.dotColor}`} />
                      <span
                        className={`text-[9px] font-medium flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${
                          card.trend.positive
                            ? "text-emerald-700 bg-emerald-50 border border-emerald-100/50"
                            : "text-rose-700 bg-rose-50 border border-rose-100/50"
                        }`}
                      >
                        {card.trend.positive ? (
                          <TrendingUp className="h-2.5 w-2.5" aria-hidden="true" />
                        ) : (
                          <TrendingDown className="h-2.5 w-2.5" aria-hidden="true" />
                        )}
                        {card.trend.val}
                      </span>
                    </div>
                  </div>

                  <span className="text-2xl font-bold text-zinc-900 mt-3 font-mono tracking-tight tabular-nums">
                    {card.val}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Instant Injectors Section */}
            <div className="space-y-3 pt-1">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-1 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" aria-hidden="true" /> Instant Injectors
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{
                    y: -1,
                    borderColor: "#d4d4d8",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                  }}
                  className="flex flex-col justify-between p-5 rounded-xl border border-zinc-200 bg-white transition-all text-left gap-4 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <div className="h-9 w-9 rounded-lg bg-blue-50/70 flex items-center justify-center border border-blue-100 shadow-sm text-blue-600">
                      {loading["instant-std"] ? (
                        <Loader2
                          className="h-4 w-4 animate-spin text-blue-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      )}
                    </div>
                    <span className="text-[9px] font-semibold uppercase text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded">
                      Standard
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">
                      Standard Order Preset
                    </h3>
                    <p className="text-xs text-zinc-500 leading-normal font-normal">
                      Generates a standard customer delivery order matching local merchant menu
                      catalog and fires it directly into the queue.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={status !== "connected" || Object.values(loading).some(Boolean)}
                    onClick={() => {
                      const randIndex = Math.floor(Math.random() * SIMULATE_ORDER_SCENARIOS.length);
                      triggerSimulation(randIndex, false);
                    }}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition-all border border-blue-700 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    Inject Standard
                  </button>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -1,
                    borderColor: "#d4d4d8",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                  }}
                  className="flex flex-col justify-between p-5 rounded-xl border border-zinc-200 bg-white transition-all text-left gap-4 shadow-xs"
                >
                  <div className="flex justify-between items-start">
                    <div className="h-9 w-9 rounded-lg bg-rose-50/70 flex items-center justify-center border border-rose-100 shadow-sm text-rose-600">
                      {loading["instant-urg"] ? (
                        <Loader2
                          className="h-4 w-4 animate-spin text-rose-650"
                          aria-hidden="true"
                        />
                      ) : (
                        <Flame className="h-4 w-4" aria-hidden="true" />
                      )}
                    </div>
                    <span className="text-[9px] font-semibold uppercase text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                      Critical Delay
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">
                      Urgent Order Preset
                    </h3>
                    <p className="text-xs text-zinc-500 leading-normal font-normal">
                      Generates a mock order with a 250s delayed timestamp. This triggers the
                      high-priority warning animations in the dashboard.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={status !== "connected" || Object.values(loading).some(Boolean)}
                    onClick={() => {
                      const randIndex = Math.floor(Math.random() * SIMULATE_ORDER_SCENARIOS.length);
                      triggerSimulation(randIndex, true);
                    }}
                    className="w-full py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer transition-all border border-rose-750 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Flame className="h-4 w-4" aria-hidden="true" />
                    Inject Urgent
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Scenario Cards Section */}
            <div className="space-y-3 pt-1">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider px-1.5 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" aria-hidden="true" /> Mock Scenario
                Templates
              </span>

              <div className="space-y-3">
                {SIMULATE_ORDER_SCENARIOS.map((scenario, index) => {
                  const keyStd = `${index}-standard`;
                  const keyUrg = `${index}-urgent`;
                  const avatarStyle = getAvatarStyle(scenario.customerName);

                  return (
                    <motion.div
                      key={scenario.customerId}
                      whileHover={{
                        y: -1,
                        borderColor: "#d4d4d8",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                      }}
                      className="rounded-xl border border-zinc-200 bg-white p-4 shadow-xs transition-all duration-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-4 min-w-0">
                          <div
                            className={`h-9 w-9 shrink-0 rounded-lg border flex items-center justify-center text-sm font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] ${avatarStyle.bg}`}
                          >
                            {scenario.customerName.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            <div className="md:col-span-4 min-w-0">
                              <h4 className="text-xs font-bold text-zinc-900 tracking-tight truncate">
                                {scenario.customerName}
                              </h4>
                              <p className="text-[10px] text-zinc-450 font-mono flex items-center gap-1 mt-0.5 font-medium">
                                <Phone className="h-3 w-3 text-zinc-400" aria-hidden="true" />
                                {scenario.customerPhone}
                              </p>
                            </div>

                            <div className="md:col-span-8 flex flex-wrap items-center gap-1.5">
                              {scenario.items.map((item) => {
                                const isVeg =
                                  item.name.toLowerCase().includes("litti") ||
                                  item.name.toLowerCase().includes("poha") ||
                                  item.name.toLowerCase().includes("vada");
                                return (
                                  <span
                                    key={item.id}
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-50 border border-zinc-200/50 text-[10px] font-semibold text-zinc-700 shadow-xs"
                                  >
                                    {isVeg ? (
                                      <svg
                                        className="h-3 w-3 text-emerald-600 shrink-0"
                                        viewBox="0 0 100 100"
                                        aria-label="Veg"
                                      >
                                        <rect
                                          x="10"
                                          y="10"
                                          width="80"
                                          height="80"
                                          rx="12"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="12"
                                        />
                                        <circle cx="50" cy="50" r="22" fill="currentColor" />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="h-3 w-3 text-rose-600 shrink-0"
                                        viewBox="0 0 100 100"
                                        aria-label="Non-veg"
                                      >
                                        <rect
                                          x="10"
                                          y="10"
                                          width="80"
                                          height="80"
                                          rx="12"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="12"
                                        />
                                        <polygon points="50,22 22,72 78,72" fill="currentColor" />
                                      </svg>
                                    )}
                                    <span className="text-zinc-800 font-medium truncate max-w-[130px]">
                                      {item.name}
                                    </span>
                                    <span className="text-zinc-400 font-mono text-[9px] tabular-nums">
                                      × {item.quantity}
                                    </span>
                                  </span>
                                );
                              })}

                              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-50 border border-zinc-200/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                queue: placed
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-zinc-100 pt-3 lg:pt-0 shrink-0">
                          <div className="lg:text-right min-w-[70px]">
                            <div className="text-xs font-bold text-zinc-900 font-mono tracking-tight tabular-nums">
                              ₹{scenario.totalAmount}
                            </div>
                            <div className="text-[9px] text-zinc-400 font-mono font-medium">
                              #{scenario.customerId.split("_")[1] || scenario.customerId}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              disabled={status !== "connected" || loading[keyStd]}
                              onClick={() => triggerSimulation(index, false)}
                              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 shadow-xs cursor-pointer transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              {loading[keyStd] ? (
                                <Loader2
                                  className="h-3 w-3 animate-spin text-zinc-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ShoppingBag className="h-3 w-3 text-zinc-400" aria-hidden="true" />
                              )}
                              Inject
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              type="button"
                              disabled={status !== "connected" || loading[keyUrg]}
                              onClick={() => triggerSimulation(index, true)}
                              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 shadow-xs cursor-pointer transition-all flex items-center gap-1 disabled:opacity-50"
                            >
                              {loading[keyUrg] ? (
                                <Loader2
                                  className="h-3 w-3 animate-spin text-rose-600"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Flame className="h-3 w-3 text-rose-500" aria-hidden="true" />
                              )}
                              Urgent
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        ) : activeTab === "custom" ? (
          <div className="space-y-5 max-w-xl mx-auto">
            <div className="rounded-xl border border-zinc-200 bg-white p-5.5 space-y-5 shadow-xs">
              <span className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" aria-hidden="true" /> Custom Order
                Specification
              </span>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="customNameInput"
                    className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-0.5 block cursor-pointer"
                  >
                    Customer Name
                  </label>
                  <input
                    id="customNameInput"
                    name="customerName"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter customer name… e.g., Khatri Ravi"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs font-medium text-zinc-850 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="customPhoneInput"
                    className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-0.5 block cursor-pointer"
                  >
                    Phone Number
                  </label>
                  <input
                    id="customPhoneInput"
                    name="customerPhone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="Enter phone number… e.g., +91 99999 88888"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-xs font-medium text-zinc-850 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-0.5">
                  Select Order Items
                </span>
                <div className="space-y-2">
                  {MENU_ITEMS_PRESETS.map((item) => {
                    const qty = selectedQuantities[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${qty > 0 ? "border-blue-200 bg-blue-50/15" : "border-zinc-200 bg-zinc-50/20"}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl" role="img" aria-label={item.name}>
                            {item.emoji}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-zinc-800">{item.name}</div>
                            <div className="text-[9px] text-zinc-500 font-mono font-bold mt-0.5 flex items-center gap-2">
                              <span className="text-zinc-700 tabular-nums">₹{item.price}</span>
                              <span className="text-[7px] text-zinc-300 font-sans">●</span>
                              <span
                                className={`flex items-center gap-1 font-bold ${item.type === "veg" ? "text-emerald-600" : "text-rose-600"}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${item.type === "veg" ? "bg-emerald-500" : "bg-rose-500"}`}
                                />
                                {item.type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-6 w-6 rounded bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 hover:text-zinc-800 cursor-pointer active:scale-95 transition-all shadow-xs"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="h-3 w-3" aria-hidden="true" />
                          </motion.button>
                          <span className="text-xs font-bold text-zinc-800 font-mono min-w-4 text-center tabular-nums">
                            {qty}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-6 w-6 rounded bg-white border border-zinc-200 flex items-center justify-center text-blue-600 hover:text-blue-700 cursor-pointer active:scale-95 transition-all shadow-xs"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="h-3 w-3" aria-hidden="true" />
                          </motion.button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between items-center py-2 px-1 border-t border-zinc-100 pt-4">
                <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                  Cart Subtotal
                </span>
                <span className="text-sm font-bold text-zinc-900 font-mono tracking-tight bg-zinc-50 px-3 py-0.5 rounded-lg border border-zinc-200 tabular-nums">
                  ₹
                  {MENU_ITEMS_PRESETS.reduce(
                    (acc, curr) => acc + curr.price * (selectedQuantities[curr.id] || 0),
                    0,
                  )}
                </span>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                disabled={
                  status !== "connected" ||
                  loading["custom-inject"] ||
                  Object.values(selectedQuantities).reduce((acc, curr) => acc + curr, 0) === 0
                }
                onClick={injectCustomOrder}
                className="w-full py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none border border-blue-700"
              >
                {loading["custom-inject"] ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                )}
                Inject Custom Order
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 max-w-2xl mx-auto">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="h-4 w-4 text-blue-600" aria-hidden="true" /> System Request
                Timeline (<span className="tabular-nums">{orders.length}</span>)
              </span>

              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="p-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-500 active:scale-95 transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-zinc-500/25"
                title="Refresh logs"
                aria-label="Refresh timeline logs"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              </motion.button>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 p-10 text-center text-zinc-400 text-xs bg-white">
                No requests recorded in the system logs.
              </div>
            ) : (
              <div className="relative pl-5 space-y-4 border-l-2 border-zinc-150 ml-3.5">
                <AnimatePresence initial={false}>
                  {orders.map((order) => {
                    const isSimulated = order.id.startsWith("63") && order.id.length === 10;
                    const keyPrg = `progress-${order.id}`;
                    const showProgressButton = [
                      "placed",
                      "preparing",
                      "ready_for_pickup",
                      "dispatched",
                    ].includes(order.status);
                    const orderStyle = getStatusStyle(order.status);
                    const isExpanded = expandedOrderId === order.id;

                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="relative"
                      >
                        <div
                          className={`absolute -left-[28px] top-4.5 h-3 w-3 rounded-full border-2 border-white ${orderStyle.dot}`}
                        />

                        <div
                          className={`rounded-xl border bg-white p-3.5 space-y-3 shadow-xs hover:border-zinc-300 transition-all duration-200 ${
                            isExpanded ? "border-zinc-300 shadow-sm" : "border-zinc-200/70"
                          }`}
                        >
                          {/* Accordion header: clean semantic button to resolve Biome nested interactive items error */}
                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                            className="w-full flex flex-col gap-2.5 text-left focus:outline-none group cursor-pointer"
                          >
                            <div className="w-full flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-semibold text-zinc-800 font-mono tabular-nums">
                                  #{order.id.slice(-4)}
                                </span>
                                <span
                                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${orderStyle.badge}`}
                                >
                                  {getStatusLabel(order.status)}
                                </span>
                                {isSimulated && (
                                  <span className="text-[8px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100 px-1.5 rounded">
                                    Mock
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-zinc-900 font-mono tabular-nums">
                                  ₹{order.totalAmount}
                                </span>
                                <span className="text-[9px] text-zinc-400 font-mono font-medium tabular-nums">
                                  {new Date(order.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                                {isExpanded ? (
                                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400 rotate-180 transition-transform duration-200" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 group-hover:text-zinc-600" />
                                )}
                              </div>
                            </div>

                            <div className="w-full text-xs text-zinc-500 flex items-center justify-between font-medium">
                              <span className="truncate max-w-[280px] text-zinc-600 group-hover:text-zinc-950 transition-colors">
                                {order.items
                                  .map((item) => `${item.quantity}x ${item.name}`)
                                  .join(" + ")}
                              </span>
                              <span className="text-[10px] text-zinc-450 flex items-center gap-1 font-mono font-medium shrink-0">
                                <User className="h-3 w-3" aria-hidden="true" /> {order.customerName}
                              </span>
                            </div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden space-y-3 pt-3 border-t border-zinc-100"
                              >
                                <div className="grid grid-cols-2 gap-4 text-[10px]">
                                  <div className="space-y-1">
                                    <span className="text-zinc-400 font-bold block">
                                      CUSTOMER TELEPHONE
                                    </span>
                                    <span className="text-zinc-800 font-mono font-bold tabular-nums">
                                      {order.customerPhone}
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-zinc-400 font-bold block">
                                      GEO LOCATION COORDS
                                    </span>
                                    <span className="text-zinc-800 font-mono font-bold tabular-nums">
                                      [{order.deliveryCoords.join(", ")}]
                                    </span>
                                  </div>
                                </div>

                                {order.status !== "rejected" && (
                                  <div className="space-y-2 pt-1">
                                    <div className="flex justify-between text-[9px] text-zinc-450 font-bold uppercase tracking-wider">
                                      {[
                                        { status: "placed", label: "Placed" },
                                        { status: "preparing", label: "Prep" },
                                        { status: "ready_for_pickup", label: "Ready" },
                                        { status: "dispatched", label: "Transit" },
                                        { status: "delivered", label: "Arrived" },
                                      ].map((node) => {
                                        const isCurrent = order.status === node.status;
                                        return (
                                          <span
                                            key={node.status}
                                            className={`${isCurrent ? "text-blue-600 font-bold" : "opacity-80"}`}
                                          >
                                            {node.label}
                                          </span>
                                        );
                                      })}
                                    </div>

                                    <div className="relative h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/30">
                                      <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full ${orderStyle.bar}`}
                                        style={{
                                          width:
                                            order.status === "placed"
                                              ? "10%"
                                              : order.status === "preparing"
                                                ? "35%"
                                                : order.status === "ready_for_pickup"
                                                  ? "60%"
                                                  : order.status === "dispatched"
                                                    ? "85%"
                                                    : order.status === "delivered"
                                                      ? "100%"
                                                      : "0%",
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {showProgressButton && (
                                  <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    disabled={loading[keyPrg]}
                                    onClick={() => advanceOrderStatus(order)}
                                    className="w-full py-2 mt-1 text-xs font-semibold rounded-lg bg-zinc-50 border border-zinc-200 hover:border-zinc-350 hover:bg-zinc-100 text-zinc-700 shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                                  >
                                    {loading[keyPrg] ? (
                                      <Loader2
                                        className="h-3.5 w-3.5 animate-spin"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <Activity
                                        className="h-3.5 w-3.5 text-blue-600 animate-pulse"
                                        aria-hidden="true"
                                      />
                                    )}
                                    {order.status === "placed" && "Accept Order on Phone"}
                                    {order.status === "preparing" && "Mark Food Ready"}
                                    {order.status === "ready_for_pickup" && "Dispatch Rider"}
                                    {order.status === "dispatched" && "Complete Delivery"}
                                  </motion.button>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
