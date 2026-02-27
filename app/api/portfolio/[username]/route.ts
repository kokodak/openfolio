import { fetchPortfolio } from "@/lib/github";
import { buildCachedPortfolio, getCacheState, getSeenUser, triggerBackgroundRefresh, upsertSeenUser } from "@/lib/seen-users";
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
  if (existing) {
    const cacheState = getCacheState(existing);

    if (cacheState === "fresh") {
      return NextResponse.json(buildCachedPortfolio(existing, "cache-fresh"), { status: 200 });
    }

    if (cacheState === "stale") {
      triggerBackgroundRefresh(normalized, fetchPortfolio);
      return NextResponse.json(buildCachedPortfolio(existing, "cache-stale"), { status: 200 });
    }
  }

  try {
    const live = await fetchPortfolio(normalized);
    upsertSeenUser(normalized, live);
    return NextResponse.json(live, { status: 200 });
  } catch (error) {
    if (existing) {
      return NextResponse.json(buildCachedPortfolio(existing, "cache-fallback"), { status: 200 });
    }

    const message = error instanceof Error ? error.message : "Failed to fetch portfolio.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
