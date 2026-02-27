---
id: delivery-backlog
title: Product Backlog
domain: delivery
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - backlog
  - mvp
related:
  - docs/domains/delivery/roadmap.md
  - docs/domains/architecture/system-design.md
  - docs/domains/operations/session-log.md
---

# Product Backlog

## Usage

- Priority is P0 > P1 > P2.
- When an item is completed, attach relevant doc/test references.
- For new feature items, run the discuss -> docs update -> implementation flow.

## P0 (MVP Required)

- [x] Initialize Next.js project (App Router + base routes)
- [x] GitHub username input and lookup UI
- [x] GitHub API integration (live user/PR/repo ingestion)
- [x] Build runtime contribution view model (no DB for MVP)
- [x] Render baseline portfolio page (clean + modern)
- [x] Error handling and loading/empty states
- [x] In-memory seen-user background refresh

## P1 (Quality/Expansion)

- [ ] Contribution impact scoring model v1
- [ ] Project-level highlight generation
- [x] Improve PR readability with repository-grouped toggle UI
- [x] Increase PR ingestion volume with multi-page fetch
- [ ] Expand scope to issues/reviews/comments
- [ ] Durable caching and resync policy
- [ ] Baseline analysis test dataset

## P2 (Advanced)

- [ ] PDF export
- [ ] Multilingual support
- [ ] User-customized templates

## Notes

- 2026-02-27: Initial backlog created
- 2026-02-27: MVP decisions confirmed (Next.js, PR-first, real-time fetch, clean/modern UI)

## Related Docs

- `docs/domains/delivery/roadmap.md`
- `docs/domains/architecture/system-design.md`
- `docs/domains/operations/session-log.md`
