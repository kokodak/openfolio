import type { PortfolioData } from "@/types/portfolio";

type SeenUserEntry = {
  username: string;
  portfolio: PortfolioData;
  lastSyncedAt: number;
};

const seenUsers = new Map<string, SeenUserEntry>();
const inFlightRefresh = new Set<string>();

const DEFAULT_FRESH_TTL_SEC = 60;
const DEFAULT_STALE_TTL_SEC = 600;

function clampSeconds(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

function getFreshTtlMs(): number {
  const raw = Number(process.env.CACHE_FRESH_TTL_SEC ?? DEFAULT_FRESH_TTL_SEC);
  const seconds = clampSeconds(raw, 5, 3600, DEFAULT_FRESH_TTL_SEC);
  return seconds * 1000;
}

function getStaleTtlMs(): number {
  const raw = Number(process.env.CACHE_STALE_TTL_SEC ?? DEFAULT_STALE_TTL_SEC);
  const seconds = clampSeconds(raw, 30, 86400, DEFAULT_STALE_TTL_SEC);
  return seconds * 1000;
}

export type CacheState = "fresh" | "stale" | "expired";

export function getSeenUser(username: string): SeenUserEntry | undefined {
  return seenUsers.get(username.toLowerCase());
}

export function upsertSeenUser(username: string, portfolio: PortfolioData): void {
  seenUsers.set(username.toLowerCase(), {
    username: username.toLowerCase(),
    portfolio,
    lastSyncedAt: Date.now()
  });
}

export function shouldRefresh(entry: SeenUserEntry): boolean {
  return getCacheState(entry) !== "fresh";
}

export function getCacheState(entry: SeenUserEntry): CacheState {
  const ageMs = Date.now() - entry.lastSyncedAt;
  const freshTtlMs = getFreshTtlMs();
  const staleTtlMs = Math.max(getStaleTtlMs(), freshTtlMs + 1000);

  if (ageMs <= freshTtlMs) {
    return "fresh";
  }

  if (ageMs <= staleTtlMs) {
    return "stale";
  }

  return "expired";
}

export function buildCachedPortfolio(
  entry: SeenUserEntry,
  source: "cache-fresh" | "cache-stale" | "cache-fallback"
): PortfolioData {
  return {
    ...entry.portfolio,
    source,
    generatedAt: new Date(entry.lastSyncedAt).toISOString()
  };
}

export function triggerBackgroundRefresh(
  username: string,
  refreshFn: (username: string) => Promise<PortfolioData>
): void {
  const key = username.toLowerCase();
  if (inFlightRefresh.has(key)) {
    return;
  }

  inFlightRefresh.add(key);
  void refreshFn(key)
    .then((portfolio) => {
      upsertSeenUser(key, portfolio);
    })
    .catch(() => {
      // Keep stale cache when refresh fails; live path still retries on demand.
    })
    .finally(() => {
      inFlightRefresh.delete(key);
    });
}
