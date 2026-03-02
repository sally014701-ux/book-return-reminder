/**
 * MVP: 인메모리 저장소.
 * Vercel 배포 시 인스턴스별로 데이터가 갈라지므로, 실제 운영에서는
 * Vercel KV, Supabase 등 영구 저장소로 교체하는 것을 권장합니다.
 */
export type StoredReminder = {
  id: string;
  email: string;
  borrowDate: string; // YYYY-MM-DD
  returnDate: string; // YYYY-MM-DD
  sentD3: boolean;
  sentD1: boolean;
  sentD0: boolean;
  createdAt: string;
};

const store = new Map<string, StoredReminder>();

export function saveReminder(reminder: Omit<StoredReminder, "id" | "sentD3" | "sentD1" | "sentD0" | "createdAt">): StoredReminder {
  const id = `rem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const record: StoredReminder = {
    ...reminder,
    id,
    sentD3: false,
    sentD1: false,
    sentD0: false,
    createdAt: new Date().toISOString(),
  };
  store.set(id, record);
  return record;
}

export function getAllReminders(): StoredReminder[] {
  return Array.from(store.values());
}

export function markSent(id: string, which: "sentD3" | "sentD1" | "sentD0"): void {
  const r = store.get(id);
  if (r) r[which] = true;
}
