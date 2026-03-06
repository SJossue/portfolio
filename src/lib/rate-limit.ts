/** In-memory sliding-window rate limiter with global daily budget. */

interface Entry {
  timestamps: number[];
}

const store = new Map<string, Entry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 10; // per-IP requests per minute
const DAILY_WINDOW_MS = 86_400_000; // 24 hours
const MAX_PER_IP_DAY = 50; // per-IP daily cap
const GLOBAL_DAILY_CAP = 200; // total requests across all visitors per day

// Global counter
let globalTimestamps: number[] = [];

// Prune stale entries every 5 minutes to prevent memory leak
const PRUNE_INTERVAL_MS = 300_000;
let lastPrune = Date.now();

function prune(now: number) {
  if (now - lastPrune < PRUNE_INTERVAL_MS) return;
  lastPrune = now;
  globalTimestamps = globalTimestamps.filter((t) => now - t < DAILY_WINDOW_MS);
  for (const [key, entry] of store) {
    const fresh = entry.timestamps.filter((t) => now - t < DAILY_WINDOW_MS);
    if (fresh.length === 0) store.delete(key);
    else entry.timestamps = fresh;
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now();
  prune(now);

  // --- Global daily budget ---
  globalTimestamps = globalTimestamps.filter((t) => now - t < DAILY_WINDOW_MS);
  if (globalTimestamps.length >= GLOBAL_DAILY_CAP) {
    return { allowed: false, retryAfterMs: DAILY_WINDOW_MS - (now - globalTimestamps[0]) };
  }

  const entry = store.get(ip) ?? { timestamps: [] };
  store.set(ip, entry);
  entry.timestamps = entry.timestamps.filter((t) => now - t < DAILY_WINDOW_MS);

  // --- Per-IP daily limit ---
  if (entry.timestamps.length >= MAX_PER_IP_DAY) {
    const oldest = entry.timestamps[0];
    return { allowed: false, retryAfterMs: DAILY_WINDOW_MS - (now - oldest) };
  }

  // --- Per-IP per-minute limit ---
  const recentCount = entry.timestamps.filter((t) => now - t < WINDOW_MS).length;
  if (recentCount >= MAX_PER_WINDOW) {
    const oldestInWindow = entry.timestamps.filter((t) => now - t < WINDOW_MS)[0];
    return { allowed: false, retryAfterMs: WINDOW_MS - (now - oldestInWindow) };
  }

  entry.timestamps.push(now);
  globalTimestamps.push(now);
  return { allowed: true };
}

/** Check if the global daily budget is exhausted (for client fallback). */
export function isGlobalBudgetExhausted(): boolean {
  const now = Date.now();
  globalTimestamps = globalTimestamps.filter((t) => now - t < DAILY_WINDOW_MS);
  return globalTimestamps.length >= GLOBAL_DAILY_CAP;
}
