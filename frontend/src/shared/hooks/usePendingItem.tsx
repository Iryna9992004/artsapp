import { useCallback, useEffect, useState } from "react";
import {
  CHANGE_EVENT,
  clearPendingItem,
  getPendingItem,
} from "@/shared/lib/pendingItem";

// Повертає оптимістичний (щойно створений) айтем для заданого ключа та функцію
// для його очищення (коли реплікація завершилась і айтем уже прийшов з бекенду).
export function usePendingItem<T>(key: string) {
  const [item, setItem] = useState<T | null>(null);

  useEffect(() => {
    const read = () => setItem(getPendingItem<T>(key));
    read();
    window.addEventListener(CHANGE_EVENT, read);
    return () => window.removeEventListener(CHANGE_EVENT, read);
  }, [key]);

  const clear = useCallback(() => {
    clearPendingItem(key);
    setItem(null);
  }, [key]);

  return { item, clear };
}
