import type {
  CommentSummary,
  IssueSummary,
  PortfolioData,
  PullRequestGroup,
  PullRequestSummary,
  RepoSummary,
  ReviewSummary,
  UserProfile
} from "@/types/portfolio";

const GITHUB_API_BASE = "https://api.github.com";

function getHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function fetchGitHub<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers: getHeaders(),
    next: { revalidate: 0 },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  followers: number;
  following: number;
  public_repos: number;
};

type GitHubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
};

type GitHubSearchItem = {
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  comments: number;
  pull_request?: {
    url: string;
  };
  repository_url: string;
};

type GitHubSearchResult = {
  items: GitHubSearchItem[];
};

type GitHubReviewEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: {
    name: string;
  };
  payload?: {
    review?: {
      state?: string;
      submitted_at?: string;
      html_url?: string;
    };
    pull_request?: {
      html_url?: string;
    };
  };
};

type GitHubPullRequestDetail = {
  merged_at: string | null;
};

type GitHubRepositoryDetail = {
  stargazers_count: number;
  open_graph_image_url: string | null;
};

type RepositoryMeta = {
  stargazersCount: number;
  repositoryImageUrl: string;
};

const SEARCH_PR_PER_PAGE = 100;
const SEARCH_MISC_PER_PAGE = 50;
const DEFAULT_MAX_PR_PAGES = 5;
const DEFAULT_MAX_MISC_PAGES = 2;
const DEFAULT_MAX_PR_ENRICH = 80;
const DEFAULT_MAX_REVIEW_EVENT_PAGES = 2;

function getMaxPrPages(): number {
  const raw = Number(process.env.MAX_PR_PAGES ?? DEFAULT_MAX_PR_PAGES);
  if (!Number.isFinite(raw)) return DEFAULT_MAX_PR_PAGES;
  return Math.max(1, Math.min(10, Math.floor(raw)));
}

function getMaxPrEnrich(): number {
  const raw = Number(process.env.MAX_PR_ENRICH ?? DEFAULT_MAX_PR_ENRICH);
  if (!Number.isFinite(raw)) return DEFAULT_MAX_PR_ENRICH;
  return Math.max(0, Math.min(200, Math.floor(raw)));
}

function getMaxMiscPages(): number {
  const raw = Number(process.env.MAX_MISC_PAGES ?? DEFAULT_MAX_MISC_PAGES);
  if (!Number.isFinite(raw)) return DEFAULT_MAX_MISC_PAGES;
  return Math.max(1, Math.min(10, Math.floor(raw)));
}

function getMaxReviewEventPages(): number {
  const raw = Number(process.env.MAX_REVIEW_EVENT_PAGES ?? DEFAULT_MAX_REVIEW_EVENT_PAGES);
  if (!Number.isFinite(raw)) return DEFAULT_MAX_REVIEW_EVENT_PAGES;
  return Math.max(1, Math.min(10, Math.floor(raw)));
}

async function fetchPullRequests(username: string): Promise<GitHubSearchItem[]> {
  const all: GitHubSearchItem[] = [];
  const seen = new Set<string>();
  const maxPages = getMaxPrPages();

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await fetchGitHub<GitHubSearchResult>(
      `/search/issues?q=author:${encodeURIComponent(username)}+type:pr&sort=updated&order=desc&per_page=${SEARCH_PR_PER_PAGE}&page=${page}`
    );

    for (const item of result.items) {
      if (!item.pull_request) continue;
      if (seen.has(item.html_url)) continue;
      seen.add(item.html_url);
      all.push(item);
    }

    if (result.items.length < SEARCH_PR_PER_PAGE) {
      break;
    }
  }

  return all;
}

async function fetchSearchItems(query: string, maxPages: number, perPage: number): Promise<GitHubSearchItem[]> {
  const all: GitHubSearchItem[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= maxPages; page += 1) {
    const result = await fetchGitHub<GitHubSearchResult>(
      `/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=${perPage}&page=${page}`
    );

    for (const item of result.items) {
      if (seen.has(item.html_url)) continue;
      seen.add(item.html_url);
      all.push(item);
    }

    if (result.items.length < perPage) {
      break;
    }
  }

  return all;
}

async function fetchReviewActivities(username: string): Promise<ReviewSummary[]> {
  const maxPages = getMaxReviewEventPages();
  const reviews: ReviewSummary[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= maxPages; page += 1) {
    const events = await fetchGitHub<GitHubReviewEvent[]>(`/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`);
    for (const event of events) {
      if (event.type !== "PullRequestReviewEvent") continue;

      const htmlUrl = event.payload?.review?.html_url ?? event.payload?.pull_request?.html_url;
      if (!htmlUrl || seen.has(htmlUrl)) continue;
      seen.add(htmlUrl);

      reviews.push({
        id: event.id,
        htmlUrl,
        repositoryFullName: event.repo.name,
        state: event.payload?.review?.state ?? null,
        submittedAt: event.payload?.review?.submitted_at ?? event.created_at ?? null
      });
    }

    if (events.length < 100) break;
  }

  return reviews;
}

async function enrichMergedAt(items: GitHubSearchItem[]): Promise<Map<string, string | null>> {
  const mergedMap = new Map<string, string | null>();
  const maxEnrich = getMaxPrEnrich();
  const targets = items.slice(0, maxEnrich);

  await Promise.all(
    targets.map(async (item) => {
      const repositoryFullName = item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, "");
      const key = `${repositoryFullName}#${item.number}`;

      try {
        const detail = await fetchGitHub<GitHubPullRequestDetail>(`/repos/${repositoryFullName}/pulls/${item.number}`);
        mergedMap.set(key, detail.merged_at);
      } catch {
        mergedMap.set(key, null);
      }
    })
  );

  return mergedMap;
}

function buildFallbackRepositoryImageUrl(repositoryFullName: string): string {
  return `https://opengraph.githubassets.com/1/${repositoryFullName}`;
}

async function fetchRepositoryMeta(repositoryFullNames: string[]): Promise<Map<string, RepositoryMeta>> {
  const meta = new Map<string, RepositoryMeta>();
  const targets = Array.from(new Set(repositoryFullNames));

  await Promise.all(
    targets.map(async (repositoryFullName) => {
      try {
        const detail = await fetchGitHub<GitHubRepositoryDetail>(`/repos/${repositoryFullName}`);
        meta.set(repositoryFullName, {
          stargazersCount: detail.stargazers_count,
          repositoryImageUrl: detail.open_graph_image_url ?? buildFallbackRepositoryImageUrl(repositoryFullName)
        });
      } catch {
        meta.set(repositoryFullName, {
          stargazersCount: 0,
          repositoryImageUrl: buildFallbackRepositoryImageUrl(repositoryFullName)
        });
      }
    })
  );

  return meta;
}

export async function fetchPortfolio(username: string): Promise<PortfolioData> {
  const normalized = username.trim();
  if (!normalized) {
    throw new Error("Username is required.");
  }

  const [user, repos, prItems, issueItems, commentItems, reviewActivities] = await Promise.all([
    fetchGitHub<GitHubUser>(`/users/${normalized}`),
    fetchGitHub<GitHubRepo[]>(`/users/${normalized}/repos?sort=stars&per_page=6`),
    fetchPullRequests(normalized),
    fetchSearchItems(`author:${normalized} type:issue`, getMaxMiscPages(), SEARCH_MISC_PER_PAGE),
    fetchSearchItems(`commenter:${normalized}`, getMaxMiscPages(), SEARCH_MISC_PER_PAGE),
    fetchReviewActivities(normalized)
  ]);
  const mergedMap = await enrichMergedAt(prItems);

  const profile: UserProfile = {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    htmlUrl: user.html_url,
    followers: user.followers,
    following: user.following,
    publicRepos: user.public_repos
  };

  const topRepos: RepoSummary[] = repos.map((repo) => ({
    name: repo.name,
    htmlUrl: repo.html_url,
    description: repo.description,
    language: repo.language,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count
  }));

  function computeImpactScore(params: { mergedAt: string | null; comments: number; updatedAt: string }): number {
    const mergedScore = params.mergedAt ? 55 : 20;
    const commentScore = Math.min(params.comments, 20);
    const ageDays = Math.max(
      0,
      Math.floor((Date.now() - new Date(params.updatedAt).getTime()) / (1000 * 60 * 60 * 24))
    );
    const recencyScore = Math.max(0, 25 - Math.floor(ageDays / 7));
    return mergedScore + commentScore + recencyScore;
  }

  const pullRequests: PullRequestSummary[] = prItems.map((item) => {
    const repositoryFullName = item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, "");
    const key = `${repositoryFullName}#${item.number}`;

    return {
      id: item.number,
      title: item.title,
      htmlUrl: item.html_url,
      repositoryFullName,
      state: item.state,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      mergedAt: mergedMap.get(key) ?? null,
      comments: item.comments,
      impactScore: computeImpactScore({
        mergedAt: mergedMap.get(key) ?? null,
        comments: item.comments,
        updatedAt: item.updated_at
      })
    };
  });

  const grouped = new Map<string, PullRequestSummary[]>();
  for (const pr of pullRequests) {
    const existing = grouped.get(pr.repositoryFullName) ?? [];
    existing.push(pr);
    grouped.set(pr.repositoryFullName, existing);
  }
  const repositoryMeta = await fetchRepositoryMeta(Array.from(grouped.keys()));

  const pullRequestGroups: PullRequestGroup[] = Array.from(grouped.entries())
    .map(([repositoryFullName, repositoryPullRequests]) => {
      const meta = repositoryMeta.get(repositoryFullName);
      return {
        repositoryFullName,
        repositoryUrl: `https://github.com/${repositoryFullName}`,
        repositoryImageUrl: meta?.repositoryImageUrl ?? buildFallbackRepositoryImageUrl(repositoryFullName),
        stargazersCount: meta?.stargazersCount ?? 0,
        total: repositoryPullRequests.length,
        pullRequests: repositoryPullRequests
      };
    })
    .sort(
      (a, b) =>
        b.stargazersCount - a.stargazersCount || b.total - a.total || a.repositoryFullName.localeCompare(b.repositoryFullName)
    );

  const issues: IssueSummary[] = issueItems
    .filter((item) => !item.pull_request)
    .map((item) => ({
      id: item.number,
      title: item.title,
      htmlUrl: item.html_url,
      state: item.state,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      repositoryFullName: item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, ""),
      comments: item.comments
    }));

  const commentedItems: CommentSummary[] = commentItems.map((item) => ({
    id: item.number,
    title: item.title,
    htmlUrl: item.html_url,
    repositoryFullName: item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, ""),
    updatedAt: item.updated_at
  }));

  const highlights = pullRequestGroups
    .map((group) => {
      const topPullRequest = [...group.pullRequests].sort((a, b) => b.impactScore - a.impactScore)[0];
      return topPullRequest
        ? {
            repositoryFullName: group.repositoryFullName,
            pullRequest: topPullRequest
          }
        : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => b.pullRequest.impactScore - a.pullRequest.impactScore)
    .slice(0, 6);

  return {
    profile,
    topRepos,
    pullRequests,
    pullRequestGroups,
    totalPullRequests: pullRequests.length,
    issues,
    reviewActivities,
    commentedItems,
    highlights,
    generatedAt: new Date().toISOString(),
    source: "live"
  };
}
