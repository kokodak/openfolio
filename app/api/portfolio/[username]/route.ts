import { fetchPortfolio } from "@/lib/github";
import { getSeenUser, shouldRefresh, triggerBackgroundRefresh, upsertSeenUser } from "@/lib/seen-users";
import type { PortfolioData } from "@/types/portfolio";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{
    username: string;
  }>;
};

export async function GET(_: Request, { params }: Params): Promise<NextResponse> {
  const { username } = await params;
  const normalized = username.trim().toLowerCase();

  if (!normalized) {
    return NextResponse.json({ error: "Username is required." }, { status: 400 });
  }

  const existing = getSeenUser(normalized);
  if (existing && shouldRefresh(existing)) {
    triggerBackgroundRefresh(normalized, fetchPortfolio);
  }

  try {
    const live = await fetchPortfolio(normalized);
    upsertSeenUser(normalized, live);
    return NextResponse.json(live, { status: 200 });
  } catch (error) {
    if (existing) {
      const cached: PortfolioData = {
        ...existing.portfolio,
        source: "cache-fallback",
        generatedAt: new Date(existing.lastSyncedAt).toISOString()
      };
      return NextResponse.json(cached, { status: 200 });
    }

    const message = error instanceof Error ? error.message : "Failed to fetch portfolio.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
