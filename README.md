# Openfolio

Openfolio is a Next.js web app that turns GitHub activity into a portfolio-style view.

## MVP Scope

- Username input and lookup
- Live GitHub fetch
- PR-first portfolio rendering
- In-memory seen-user refresh and cache fallback

## Getting Started

### 1) Prerequisites

- Node.js 20+
- npm 10+

### 2) Install Dependencies

```bash
npm install
```

If your global npm cache has permission issues, use a local cache:

```bash
npm install --cache .npm-cache
```

### 3) Configure Environment Variables (Optional but Recommended)

Create `.env.local`:

```bash
GITHUB_TOKEN=your_github_token
MAX_PR_PAGES=5
MAX_PR_ENRICH=80
MAX_MISC_PAGES=2
MAX_REVIEW_EVENT_PAGES=2
CACHE_FRESH_TTL_SEC=60
CACHE_STALE_TTL_SEC=600
```

- `GITHUB_TOKEN` is optional but strongly recommended to reduce rate-limit errors.
- Without token, GitHub API limits are lower.
- `MAX_PR_PAGES` controls PR search pagination depth (default: `5`, max: `10`).
- `MAX_PR_ENRICH` controls how many PRs are enriched with merged-state detail fetch (default: `80`, max: `200`).
- `MAX_MISC_PAGES` controls pagination depth for issue/comment search (default: `2`, max: `10`).
- `MAX_REVIEW_EVENT_PAGES` controls pagination depth for review events (default: `2`, max: `10`).
- `CACHE_FRESH_TTL_SEC` controls how long cached data is treated as fresh (default: `60`).
- `CACHE_STALE_TTL_SEC` controls stale cache window before expiration (default: `600`).

### 4) Run Development Server

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

### 5) Build Check

```bash
npm run build
```

## Usage

1. Enter a GitHub username on the home page.
2. Openfolio fetches user profile, repositories, and recent PR activity in real time.
3. If live fetch fails and the user was previously seen, cached in-memory data is used as fallback.

## Scripts

- `npm run dev`: start development server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run lint checks

## API Route

- `GET /api/portfolio/:username`
  - Returns profile + repositories + PR summaries
  - Primary source: live GitHub fetch
  - Cache policy:
    - `cache-fresh`: immediate return from fresh in-memory cache
    - `cache-stale`: return stale cache and trigger background refresh
    - `cache-fallback`: live fetch failed, returned cached data

## Known Limitations (Current MVP)

- PR merged state is not fully enriched yet (`mergedAt` is currently conservative).
- In-memory cache resets on process restart/redeploy.
- Issues/reviews/comments are planned for next phases.
