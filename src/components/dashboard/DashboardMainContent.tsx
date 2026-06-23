"use client";

import CustomerComplaints from "@/features/complaints/components/CustomerComplaints";
import MenuEditor from "@/features/menu/components/MenuEditor";
import OrderHistoryPage from "@/features/orders/components/OrderHistoryPage";
import OrdersPage from "@/features/orders/components/OrdersPage";
import CustomerReviews from "@/features/reviews/components/CustomerReviews";
import { useDashboard } from "./DashboardProvider";

export function DashboardMainContent(): React.JSX.Element {
  const {
    activeTab,
    orders,
    inventory,
    addonGroups,
    setAddonGroups,
    handleReady,
    handleDispatch,
    handleToggleStock,
    handleSaveItem,
    handleAddCategory,
    handleAddSubcategory,
  } = useDashboard();

  return (
    <main className="flex flex-1 flex-col overflow-hidden">
      {activeTab === "orders" && (
        <OrdersPage orders={orders} onReady={handleReady} onDispatch={handleDispatch} />
      )}

      {activeTab === "menu" && (
        <MenuEditor
          inventory={inventory}
          onToggleStock={handleToggleStock}
          onSaveItem={handleSaveItem}
          onAddCategory={handleAddCategory}
          onAddSubcategory={handleAddSubcategory}
          addonGroups={addonGroups}
          setAddonGroups={setAddonGroups}
        />
      )}

      {activeTab === "history" && <OrderHistoryPage orders={orders} />}

      {activeTab === "complaints" && <CustomerComplaints />}

      {activeTab === "reviews" && <CustomerReviews />}
    </main>
  );
}
