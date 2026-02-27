export type UserProfile = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  htmlUrl: string;
  followers: number;
  following: number;
  publicRepos: number;
};

export type RepoSummary = {
  name: string;
  htmlUrl: string;
  description: string | null;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
};

export type PullRequestSummary = {
  id: number;
  title: string;
  htmlUrl: string;
  repositoryFullName: string;
  state: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  comments: number;
};

export type PortfolioData = {
  profile: UserProfile;
  topRepos: RepoSummary[];
  pullRequests: PullRequestSummary[];
  generatedAt: string;
  source: "live" | "cache-fallback";
};
