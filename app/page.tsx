"use client";

import { useMemo, useState } from "react";
import type { PortfolioData } from "@/types/portfolio";

export default function HomePage(): React.JSX.Element {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PortfolioData | null>(null);

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
            <ul className="list">
              {data.topRepos.map((repo) => (
                <li key={repo.htmlUrl}>
                  <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
                    {repo.name}
                  </a>
                  <p>{repo.description ?? "No description"}</p>
                  <p className="meta">
                    {repo.language ?? "N/A"} · Stars {repo.stargazersCount} · Forks {repo.forksCount}
                  </p>
                </li>
              ))}
            </ul>
          </article>

          <article className="card">
            <h3>Recent Pull Requests</h3>
            <ul className="list">
              {data.pullRequests.map((pr) => (
                <li key={`${pr.repositoryFullName}-${pr.id}`}>
                  <a href={pr.htmlUrl} target="_blank" rel="noreferrer">
                    {pr.title}
                  </a>
                  <p>{pr.repositoryFullName}</p>
                  <p className="meta">
                    {pr.state.toUpperCase()} · Comments {pr.comments} · Updated{" "}
                    {new Date(pr.updatedAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </article>
        </section>
      )}
    </main>
  );
}
