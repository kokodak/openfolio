import type { PortfolioData } from "@/types/portfolio";

type SeenUserEntry = {
  username: string;
  portfolio: PortfolioData;
  lastSyncedAt: number;
};

const seenUsers = new Map<string, SeenUserEntry>();
const inFlightRefresh = new Set<string>();

const REFRESH_TTL_MS = 1000 * 60 * 10;

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
  return Date.now() - entry.lastSyncedAt > REFRESH_TTL_MS;
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
