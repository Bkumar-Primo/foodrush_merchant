"use client";

import { useEffect } from "react";
import { ensureMerchantDocument, subscribeToMerchant, toMerchantStatus } from "@/lib/db/merchant";
import { getFirestoreDb } from "@/lib/db/firebaseClient";
import { useDashboardStore } from "@/stores/useDashboardStore";

export function useMerchantFirestoreSync(): void {
  const setMerchantStatus = useDashboardStore((state) => state.setMerchantStatus);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) {
      return;
    }

    let cancelled = false;

    void ensureMerchantDocument().catch((error) => {
      console.error("[Merchant] Failed to ensure merchant document.", error);
    });

    const unsubscribe = subscribeToMerchant((merchant) => {
      if (cancelled) {
        return;
      }
      setMerchantStatus(toMerchantStatus(merchant.status));
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [setMerchantStatus]);
}
