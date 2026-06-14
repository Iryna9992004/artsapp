// Зберігання щойно створеного айтема ("оптимістичного"), щоб одразу показати його
// у списку, поки триває асинхронна реплікація PostgreSQL → ClickHouse.
// Айтем тримається в sessionStorage із міткою часу й автоматично "протухає".

const EXPIRY_MS = 30_000;
const CHANGE_EVENT = "pending-item-change";

export const PENDING_KEYS = {
  event: "pendingEvent",
  post: "pendingPost",
  topic: "pendingTopic",
} as const;

interface PendingEntry<T> {
  item: T;
  ts: number;
}

export function setPendingItem<T extends { id: number }>(
  key: string,
  item: T,
): void {
  if (typeof window === "undefined") return;
  try {
    const entry: PendingEntry<T> = { item, ts: Date.now() };
    sessionStorage.setItem(key, JSON.stringify(entry));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore storage errors
  }
}

export function getPendingItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingEntry<T>;
    if (!parsed?.ts || Date.now() - parsed.ts > EXPIRY_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return parsed.item;
  } catch {
    return null;
  }
}

export function clearPendingItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore storage errors
  }
}

export { CHANGE_EVENT };
