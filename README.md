# Openfolio

Openfolio is a Next.js web app that turns GitHub activity into a portfolio-style view.

## MVP Scope

- Username input and lookup
- Live GitHub fetch
- PR-first portfolio rendering
- In-memory seen-user refresh and cache fallback

## Local Run

1. Install dependencies:
   - `npm install`
2. Start development server:
   - `npm run dev`
3. Open:
   - `http://localhost:3000`

## Optional Environment Variable

- `GITHUB_TOKEN`: improves GitHub API rate limits for server-side requests
