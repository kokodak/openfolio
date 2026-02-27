import type { PortfolioData, PullRequestSummary, RepoSummary, UserProfile } from "@/types/portfolio";

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

export async function fetchPortfolio(username: string): Promise<PortfolioData> {
  const normalized = username.trim();
  if (!normalized) {
    throw new Error("Username is required.");
  }

  const [user, repos, prs] = await Promise.all([
    fetchGitHub<GitHubUser>(`/users/${normalized}`),
    fetchGitHub<GitHubRepo[]>(`/users/${normalized}/repos?sort=updated&per_page=6`),
    fetchGitHub<GitHubSearchResult>(
      `/search/issues?q=author:${encodeURIComponent(normalized)}+type:pr&sort=updated&order=desc&per_page=20`
    )
  ]);

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

  const pullRequests: PullRequestSummary[] = prs.items
    .filter((item) => Boolean(item.pull_request))
    .map((item) => {
      const repositoryFullName = item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, "");

      return {
        id: item.number,
        title: item.title,
        htmlUrl: item.html_url,
        repositoryFullName,
        state: item.state,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        // Search API does not provide merged_at directly; enrich later via GraphQL/PR endpoint.
        mergedAt: null,
        comments: item.comments
      };
    });

  return {
    profile,
    topRepos,
    pullRequests,
    generatedAt: new Date().toISOString(),
    source: "live"
  };
}
