import { useEffect, useState } from "react";
import { subscribeToInventory } from "@/lib/db/firebase";
import { MenuItem } from "@/types";

export const useInventory = () => {
  const [inventory, setInventory] = useState<MenuItem[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToInventory((items) => {
      setInventory(items);
    });
    return unsubscribe;
  }, []);

  return inventory;
};
