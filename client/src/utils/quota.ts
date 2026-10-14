export interface QuotaState {
  remaining: number;
  total: number;
  isLoggedIn: boolean;
}

const GUEST_DAILY_LIMIT = 4;
const STORAGE_KEY = "convertify_guest_usage";

export function getGuestQuota(isLoggedIn: boolean): QuotaState {
  if (isLoggedIn) {
    return { remaining: 999, total: 999, isLoggedIn: true };
  }

  if (typeof window === "undefined") {
    return { remaining: GUEST_DAILY_LIMIT, total: GUEST_DAILY_LIMIT, isLoggedIn: false };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().slice(0, 10);

    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) {
        const used = data.count || 0;
        return {
          remaining: Math.max(0, GUEST_DAILY_LIMIT - used),
          total: GUEST_DAILY_LIMIT,
          isLoggedIn: false,
        };
      }
    }

    // Reset daily
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: 0 }));
    return { remaining: GUEST_DAILY_LIMIT, total: GUEST_DAILY_LIMIT, isLoggedIn: false };
  } catch {
    return { remaining: GUEST_DAILY_LIMIT, total: GUEST_DAILY_LIMIT, isLoggedIn: false };
  }
}

export function consumeGuestQuota(isLoggedIn: boolean): boolean {
  if (isLoggedIn) return true;
  if (typeof window === "undefined") return true;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().slice(0, 10);
    let count = 0;

    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) {
        count = data.count || 0;
      }
    }

    if (count >= GUEST_DAILY_LIMIT) {
      return false; // Quota exhausted
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: count + 1 }));
    return true;
  } catch {
    return true;
  }
}
