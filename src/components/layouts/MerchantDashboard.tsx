"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/layouts/Header";
import SettingsSheet from "@/components/layouts/SettingsSheet";
import NotificationsSheet from "@/components/layouts/NotificationsSheet";
import Sidebar from "@/components/layouts/Sidebar";
import NewOrderModal from "@/features/orders/components/NewOrderModal";
import CustomerComplaints from "@/features/complaints/components/CustomerComplaints";
import MenuInventory from "@/features/menu/components/MenuInventory";
import { useInventory } from "@/features/menu/hooks/useInventory";
import OrdersPage from "@/features/orders/components/OrdersPage";
import { useOrders } from "@/features/orders/hooks/useOrders";
import CustomerReviews from "@/features/reviews/components/CustomerReviews";
import { useAudioChime } from "@/hooks/useAudioChime";
import {
  addOrder,
  updateInventoryStatus,
  updateOrderStatus,
} from "@/lib/db/firebase";
import { tokens } from "@/lib/utils/tokens";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { Order } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function MerchantDashboard() {
  const {
    activeTab,
    setActiveTab,
    selectedOrderId,
    setSelectedOrderId,
    theme,
    setTheme,
    userProfile,
    activeModalOrderId,
    setActiveModalOrderId,
    minimizedOrderIds,
    addMinimizedOrderId,
    removeMinimizedOrderId,
    addNotification,
    resolveOrderNotification,
    merchantStatus,
    setMerchantStatus,
  } = useDashboardStore();

  const { playOrderChime } = useAudioChime();
  const orders = useOrders(playOrderChime);
  const inventory = useInventory();

  // Find incoming order, excluding minimized ones
  const incomingOrder = orders.find((o) => o.status === "placed" && !minimizedOrderIds.includes(o.id));
  const [modalOrder, setModalOrder] = useState<Order | null>(null);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);
  const simulationIndexRef = useRef(0);

  // Set modalOrder from either incomingOrder or activeModalOrderId
  useEffect(() => {
    if (incomingOrder) {
      setModalOrder(incomingOrder);
    } else if (activeModalOrderId) {
      const activeOrder = orders.find((o) => o.id === activeModalOrderId && o.status === "placed");
      if (activeOrder) {
        setModalOrder(activeOrder);
      } else {
        // If order is no longer placed (e.g. accepted/rejected), clear it
        setActiveModalOrderId(null);
        setModalOrder(null);
      }
    } else {
      setModalOrder(null);
    }
  }, [incomingOrder, activeModalOrderId, orders, setActiveModalOrderId]);

  // Load saved theme on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("foodrush-merchant-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("foodrush-merchant-theme", nextTheme);
  };

  // Handle order accept from modal (Kitchen prep start)
  const handleAccept = async (orderId: string, prepTime: number) => {
    await updateOrderStatus(orderId, "preparing", {
      prepTime,
      prepStartedAt: Date.now(),
    });
    removeMinimizedOrderId(orderId);
    setActiveModalOrderId(null);
    resolveOrderNotification(orderId);
  };

  // Handle food ready for pickup
  const handleReady = async (orderId: string) => {
    await updateOrderStatus(orderId, "ready_for_pickup");
  };

  // Handle dispatch (rider picks up)
  const handleDispatch = async (orderId: string) => {
    await updateOrderStatus(orderId, "dispatched");

    // Auto-deliver simulation is disabled so picked-up orders do not vanish while styling
    setTimeout(async () => {
      await updateOrderStatus(orderId, "delivered");
    }, 12000);
    
  };

  const handleToggleStock = async (itemId: string, inStock: boolean) => {
    await updateInventoryStatus(itemId, inStock);
  };

  const simulateIncomingOrder = async (pastSeconds?: number) => {
    if (merchantStatus === "Offline") {
      setShowOnlineAlert(true);
      return;
    }
    const scenarios = [
      // Scenario 1: Veg only
      {
        customerId: "cust_3127",
        customerName: "Khatri Ravi",
        customerPhone: "+91 98765 43210",
        items: [
          {
            id: "item_litti",
            name: "Crispy Tawa Fried Litti",
            price: 179,
            quantity: 4,
          },
        ],
        totalAmount: 716,
        status: "placed" as const,
        deliveryCoords: [12.9715987, 77.5945627] as [number, number],
      },
      // Scenario 2: Mixed (Veg/Non-veg)
      {
        customerId: "cust_5166",
        customerName: "Abhishek",
        customerPhone: "+91 91111 22222",
        items: [
          {
            id: "item_litti_chokha",
            name: "Litti Chokha",
            price: 147,
            quantity: 1,
          },
          {
            id: "item_ghee",
            name: "Add On: Ghee",
            price: 0,
            quantity: 1,
          },
          {
            id: "item_omelette",
            name: "Omelette",
            price: 59,
            quantity: 1,
          },
        ],
        totalAmount: 206,
        status: "placed" as const,
        deliveryCoords: [12.9715987, 77.5945627] as [number, number],
      },
      // Scenario 3: Non-veg only
      {
        customerId: "cust_9988",
        customerName: "Rahul Roy",
        customerPhone: "+91 93333 44444",
        items: [
          {
            id: "item_chicken_roll",
            name: "Chicken Tikka Roll",
            price: 180,
            quantity: 2,
          },
        ],
        totalAmount: 360,
        status: "placed" as const,
        deliveryCoords: [12.9715987, 77.5945627] as [number, number],
      },
    ];

    const mockOrder = scenarios[simulationIndexRef.current % scenarios.length];
    simulationIndexRef.current += 1;

    const newId = await addOrder(mockOrder, pastSeconds);
    setSelectedOrderId(newId);
  };

  return (
    <div
      className={`${theme} flex flex-col h-screen w-screen overflow-hidden ${tokens.colors.pageBg} font-sans ${tokens.colors.textPrimary}`}
    >
      <Header
        userProfile={userProfile}
        theme={theme}
        toggleTheme={toggleTheme}
        geoStatus={"granted"}
        requestLocation={() => {}}
      />

      <div className="flex flex-1 overflow-hidden w-full">
        <Sidebar
          orders={orders}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          simulateIncomingOrder={simulateIncomingOrder}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          {activeTab === "orders" && (
            <OrdersPage
              orders={orders}
              onReady={handleReady}
              onDispatch={handleDispatch}
            />
          )}

          {activeTab !== "orders" && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === "menu" && (
                <MenuInventory inventory={inventory} onToggleStock={handleToggleStock} />
              )}

              {activeTab === "history" && (
                <div
                  className={`rounded-2xl border ${tokens.colors.border} ${tokens.colors.cardBg} p-6 shadow-sm`}
                >
                  <h3 className={`${tokens.fontSizes.heading} ${tokens.colors.textPrimary}`}>
                    Completed Order Archive
                  </h3>
                  <p className={`${tokens.fontSizes.body} ${tokens.colors.textMuted} mt-0.5`}>
                    History of all successfully fulfilled client deliveries.
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr
                          className={`border-b ${tokens.colors.border} ${tokens.colors.textMuted} uppercase`}
                        >
                          <th className="pb-3 font-bold">Order ID</th>
                          <th className="pb-3 font-bold">Client Name</th>
                          <th className="pb-3 font-bold">Items</th>
                          <th className="pb-3 font-bold">Fulfilled Date</th>
                          <th className="pb-3 font-bold text-right">Total Billing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.filter((o) => o.status === "delivered").length === 0 ? (
                          <tr>
                            <td colSpan={5} className={`py-8 text-center ${tokens.colors.textMuted}`}>
                              No orders completed yet today.
                            </td>
                          </tr>
                        ) : (
                          orders
                            .filter((o) => o.status === "delivered")
                            .map((order) => (
                              <tr
                                key={order.id}
                                className={`border-b ${tokens.colors.borderMuted} hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20`}
                              >
                                <td className={`py-4 font-bold ${tokens.colors.textPrimary}`}>
                                  #{order.id.slice(-4).toUpperCase()}
                                </td>
                                <td className={`py-4 font-semibold ${tokens.colors.textSecondary}`}>
                                  {order.customerName}
                                </td>
                                <td className={`py-4 ${tokens.colors.textMuted}`}>
                                  {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                                </td>
                                <td className={`py-4 ${tokens.colors.textMuted}`}>
                                  {new Date(order.updatedAt).toLocaleTimeString()} (
                                  {new Date(order.updatedAt).toLocaleDateString()})
                                </td>
                                <td
                                  className={`py-4 font-extrabold text-right ${tokens.colors.successText}`}
                                >
                                  ₹{order.totalAmount + 40}
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "complaints" && <CustomerComplaints />}

              {activeTab === "reviews" && <CustomerReviews />}
            </div>
          )}
        </main>
      </div>
      <SettingsSheet />
      <NotificationsSheet />
      {modalOrder && (
        <NewOrderModal
          order={modalOrder}
          onAccept={handleAccept}
          onReject={async (orderId) => {
            await updateOrderStatus(orderId, "rejected");
            removeMinimizedOrderId(orderId);
            setActiveModalOrderId(null);
            resolveOrderNotification(orderId);
          }}
          onMinimize={() => {
            addMinimizedOrderId(modalOrder.id);
            addNotification({
              title: `New Order #${modalOrder.id.slice(-4)}`,
              description: `Incoming order for ${modalOrder.items.map(item => `${item.quantity}x ${item.name}`).join(" + ")}. Awaiting acceptance.`,
              type: "success",
              orderId: modalOrder.id,
            });
            setModalOrder(null);
            setActiveModalOrderId(null);
          }}
          onDismiss={() => {
            setModalOrder(null);
            setActiveModalOrderId(null);
          }}
          />
      )}
      <AlertDialog open={showOnlineAlert} onOpenChange={setShowOnlineAlert}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <span className="text-zinc-950 dark:text-white font-extrabold text-base">Simulation Blocked</span>
            </AlertDialogTitle>
            <div className="pt-2">
              <Alert variant="destructive" className="bg-red-50/50 border-red-200 text-red-850 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                <AlertTitle className="font-extrabold text-xs">Offline Status</AlertTitle>
                <AlertDescription className="text-[11px] leading-relaxed font-bold">
                  To start receiving orders, you need to go online first.
                </AlertDescription>
              </Alert>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="text-xs font-semibold cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setMerchantStatus("Online");
                setShowOnlineAlert(false);
              }}
              className="bg-indigo-650 hover:bg-indigo-600 text-white font-extrabold text-xs cursor-pointer"
            >
              Go Online
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default MerchantDashboard;
