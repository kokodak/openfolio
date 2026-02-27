"use client";

import { useMemo, useState } from "react";
import type { PortfolioData } from "@/types/portfolio";

export default function HomePage(): React.JSX.Element {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [expandedRepos, setExpandedRepos] = useState<Record<string, boolean>>({});

  const title = useMemo(() => {
    if (!data) return "Openfolio";
    return data.profile.name ?? data.profile.login;
  }, [data]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/portfolio/${encodeURIComponent(username.trim())}`);
      const payload = (await response.json()) as PortfolioData | { error: string };

      if (!response.ok || "error" in payload) {
        const message = "error" in payload ? payload.error : "Failed to load portfolio.";
        setError(message);
        setData(null);
        return;
      }

      setData(payload);
      setExpandedRepos((prev) => {
        const next: Record<string, boolean> = {};
        for (const group of payload.pullRequestGroups) {
          next[group.repositoryFullName] = prev[group.repositoryFullName] ?? false;
        }
        if (payload.pullRequestGroups[0]) {
          next[payload.pullRequestGroups[0].repositoryFullName] = true;
        }
        return next;
      });
    } catch {
      setError("Network error while loading portfolio.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="brand">Openfolio</p>
        <p className="eyebrow">Open Source Portfolio</p>
        <h1>{title}</h1>
        <p className="subtitle">
          Enter a GitHub username to render a clean portfolio view focused on pull request contributions.
        </p>

        <form className="search" onSubmit={onSubmit}>
          <input
            aria-label="GitHub username"
            placeholder="e.g. kokodak"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Generate"}
          </button>
        </form>
      </section>

      {error && <p className="error">{error}</p>}

      {data && (
        <section className="content">
          <article className="card profile">
            <img src={data.profile.avatarUrl} alt={`${data.profile.login} avatar`} />
            <div>
              <h2>{data.profile.name ?? data.profile.login}</h2>
              <p>@{data.profile.login}</p>
              {data.profile.bio && <p className="bio">{data.profile.bio}</p>}
              <a href={data.profile.htmlUrl} target="_blank" rel="noreferrer">
                View GitHub Profile
              </a>
              <p className="meta">
                Followers {data.profile.followers} · Following {data.profile.following} · Public repos{" "}
                {data.profile.publicRepos}
              </p>
              <p className="meta">
                Source: {data.source} · Generated: {new Date(data.generatedAt).toLocaleString()}
              </p>
            </div>
          </article>

          <article className="card">
            <h3>Top Repositories</h3>
            <ul className="repo-album">
              {data.topRepos.map((repo) => (
                <li key={repo.htmlUrl} className="repo-card">
                  <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                  <p className="repo-description">{repo.description ?? "No description"}</p>
                  <div className="repo-meta meta">
                    <span>{repo.language ?? "N/A"}</span>
                    <span>Stars {repo.stargazersCount}</span>
                    <span>Forks {repo.forksCount}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>Highlights</h3>
            <ul className="list">
              {data.highlights.map((highlight) => (
                <li key={`${highlight.repositoryFullName}-highlight-${highlight.pullRequest.id}`}>
                  <a href={highlight.pullRequest.htmlUrl} target="_blank" rel="noreferrer">
                    {highlight.pullRequest.title}
                  </a>
                  <p>{highlight.repositoryFullName}</p>
                  <p className="meta">
                    Impact {highlight.pullRequest.impactScore} ·{" "}
                    {highlight.pullRequest.mergedAt ? "MERGED" : highlight.pullRequest.state.toUpperCase()}
                  </p>
                </li>
              ))}
              {data.highlights.length === 0 && <li className="meta">No highlight candidates yet.</li>}
            </ul>
          </article>

          <article className="card">
            <h3>Pull Requests by Project</h3>
            <p className="meta">
              Total PRs loaded: {data.totalPullRequests} · Projects: {data.pullRequestGroups.length}
            </p>
            <div className="groups">
              {data.pullRequestGroups.map((group) => {
                const isOpen = expandedRepos[group.repositoryFullName] ?? false;
                return (
                  <section key={group.repositoryFullName} className="group">
                    <button
                      className="group-toggle"
                      type="button"
                      onClick={() =>
                        setExpandedRepos((prev) => ({
                          ...prev,
                          [group.repositoryFullName]: !isOpen
                        }))
                      }
                    >
                      <span>{isOpen ? "▾" : "▸"}</span>
                      <span className="group-main">
                        <img src={group.repositoryImageUrl} alt={`${group.repositoryFullName} repository image`} />
                        <span>{group.repositoryFullName}</span>
                      </span>
                      <span className="count">★ {group.stargazersCount} · {group.total} PRs</span>
                    </button>

                    {isOpen && (
                      <ul className="list">
                        {group.pullRequests.map((pr) => (
                          <li key={`${pr.repositoryFullName}-${pr.id}`}>
                            <a href={pr.htmlUrl} target="_blank" rel="noreferrer">
                              {pr.title}
                            </a>
                            <p className="meta">
                              {pr.mergedAt ? "MERGED" : pr.state.toUpperCase()} · Comments {pr.comments} · Updated{" "}
                              {new Date(pr.updatedAt).toLocaleDateString()} · Impact {pr.impactScore}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                );
              })}
            </div>
          </article>

          <article className="card">
            <h3>Other Contributions</h3>
            <div className="triplet">
              <section>
                <h4>Issues Authored ({data.issues.length})</h4>
                <ul className="list compact">
                  {data.issues.slice(0, 12).map((issue) => (
                    <li key={`${issue.repositoryFullName}-issue-${issue.id}`}>
                      <a href={issue.htmlUrl} target="_blank" rel="noreferrer">
                        {issue.title}
                      </a>
                      <p className="meta">
                        {issue.state.toUpperCase()} · {issue.repositoryFullName}
                      </p>
                    </li>
                  ))}
                  {data.issues.length === 0 && <li className="meta">No issue activity found.</li>}
                </ul>
              </section>

              <section>
                <h4>Reviews ({data.reviewActivities.length})</h4>
                <ul className="list compact">
                  {data.reviewActivities.slice(0, 12).map((review) => (
                    <li key={review.id}>
                      <a href={review.htmlUrl} target="_blank" rel="noreferrer">
                        {review.repositoryFullName}
                      </a>
                      <p className="meta">
                        {(review.state ?? "UNKNOWN").toUpperCase()} ·{" "}
                        {review.submittedAt ? new Date(review.submittedAt).toLocaleDateString() : "Unknown date"}
                      </p>
                    </li>
                  ))}
                  {data.reviewActivities.length === 0 && <li className="meta">No review activity found.</li>}
                </ul>
              </section>

              <section>
                <h4>Comments ({data.commentedItems.length})</h4>
                <ul className="list compact">
                  {data.commentedItems.slice(0, 12).map((commented) => (
                    <li key={`${commented.repositoryFullName}-comment-${commented.id}`}>
                      <a href={commented.htmlUrl} target="_blank" rel="noreferrer">
                        {commented.title}
                      </a>
                      <p className="meta">{commented.repositoryFullName}</p>
                    </li>
                  ))}
                  {data.commentedItems.length === 0 && <li className="meta">No comment activity found.</li>}
                </ul>
              </section>
            </div>
          </article>
        </section>
      )}
    </main>
  );
}
