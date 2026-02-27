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
  impactScore: number;
};

export type PullRequestGroup = {
  repositoryFullName: string;
  repositoryUrl: string;
  repositoryImageUrl: string;
  stargazersCount: number;
  total: number;
  pullRequests: PullRequestSummary[];
};

export type IssueSummary = {
  id: number;
  title: string;
  htmlUrl: string;
  state: "open" | "closed";
  createdAt: string;
  updatedAt: string;
  repositoryFullName: string;
  comments: number;
};

export type CommentSummary = {
  id: number;
  title: string;
  htmlUrl: string;
  repositoryFullName: string;
  updatedAt: string;
};

export type ReviewSummary = {
  id: string;
  htmlUrl: string;
  repositoryFullName: string;
  state: string | null;
  submittedAt: string | null;
};

export type ProjectHighlight = {
  repositoryFullName: string;
  pullRequest: PullRequestSummary;
};

export type PortfolioData = {
  profile: UserProfile;
  topRepos: RepoSummary[];
  pullRequests: PullRequestSummary[];
  pullRequestGroups: PullRequestGroup[];
  totalPullRequests: number;
  issues: IssueSummary[];
  reviewActivities: ReviewSummary[];
  commentedItems: CommentSummary[];
  highlights: ProjectHighlight[];
  generatedAt: string;
  source: "live" | "cache-fresh" | "cache-stale" | "cache-fallback";
};
