---
id: architecture-system-design-v0
title: System Design (Draft v0)
domain: architecture
status: draft
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - architecture
  - ingestion
  - rendering
related:
  - ARCHITECTURE.md
  - docs/domains/data/contribution-schema.md
  - docs/domains/delivery/backlog.md
---

# System Design (Draft v0)

## Goal

Given a GitHub username, collect, normalize, and summarize contribution history into a portfolio page.

## High-Level Architecture

1. Ingestion
2. Analysis
3. Portfolio Rendering
4. Delivery/API

## Components

### 1) Ingestion Layer

- Input: GitHub username
- Data to collect:
  - Public repositories
  - Pull requests
  - Issues / comments
  - Reviews
- Implementation candidates:
  - Prefer GitHub GraphQL API
  - Supplement with REST API as needed

### 2) Analysis Layer

- Responsibilities:
  - Normalize events into contribution units
  - Tag language/domain/role (code, review, docs)
  - Compute impact signals (merged status, engagement, repo size)
- Outputs:
  - Project-level contribution summaries
  - Tech-stack-level contribution summaries
  - Highlighted key outcomes

### 3) Portfolio Rendering Layer

- Format:
  - Profile summary
  - Contribution timeline
  - Project cards
  - Key PR details
- Sharing:
  - Public URL
  - PDF export (later phase)

### 4) API / App Layer

- API:
  - `POST /profiles/:username/sync`
  - `GET /profiles/:username`
  - `GET /profiles/:username/portfolio`
- Web:
  - Username search/create
  - Portfolio view

## Data Model (Draft)

- `users`
- `repos`
- `contributions`
- `portfolio_snapshots`

## Initial Tech Choices (Hypothesis)

- Frontend: Next.js
- Backend/API: Next.js Route Handlers or Go service
- DB: Postgres
- Queue: Start synchronous, introduce async queue later

## Risks

- GitHub API rate limit
- Accuracy in distinguishing minor vs substantial contributions
- Reliability of automated summaries

## Open Questions

- Include AI summarization in MVP, or start with rule-based summaries?
- Caching strategy for anonymous visitors?
- Portfolio visibility scope (public vs private link)?

## Delivery Gate

Before implementing architecture-affecting features:

1. Discuss behavior and scope with the user.
2. Update this document and related data/delivery docs.
3. Implement only after agreement.

## Related Docs

- `ARCHITECTURE.md`
- `docs/domains/data/contribution-schema.md`
- `docs/domains/delivery/backlog.md`
