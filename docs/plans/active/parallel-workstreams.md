---
id: plan-parallel-workstreams-v1
title: Parallel Workstreams Plan (Codex Thread Assignment)
domain: delivery
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - planning
  - parallelization
  - threads
related:
  - AGENTS.md
  - docs/domains/architecture/system-design.md
  - docs/domains/delivery/backlog.md
  - docs/domains/operations/session-log.md
---

# Parallel Workstreams Plan

This plan is designed for multi-thread execution across separate Codex sessions.

## Shared Ground Rules

1. All threads follow `discuss -> docs update -> implementation`.
2. All threads use English only.
3. Commit format: `<type>: <verb> <object/intent>`.
4. No thread changes unrelated files.
5. Each thread updates `docs/domains/operations/session-log.md` with a short entry.

## Branch Naming

- Thread branches:
  - `codex/thread-a-contract`
  - `codex/thread-b-pr-quality`
  - `codex/thread-c-contrib-expansion`
  - `codex/thread-d-ui-ia`
  - `codex/thread-e-branding`
  - `codex/thread-f-cache-sync`
  - `codex/thread-g-tests-ci`
  - `codex/thread-h-doc-ops`

## Thread Assignments

### Thread A: API Contract and Normalization Core

- Branch: `codex/thread-a-contract`
- Objective: freeze `portfolio` response contract for all downstream threads.
- Primary files:
  - `types/portfolio.ts`
  - `app/api/portfolio/[username]/route.ts`
  - `docs/domains/architecture/system-design.md`
- Deliverables:
  - versioned response fields and error format
  - migration notes for existing UI usage
- Done when:
  - route response matches documented schema exactly
  - no `any` leakage in contract-facing code

### Thread B: PR Ingestion Quality

- Branch: `codex/thread-b-pr-quality`
- Objective: improve PR data quality and merged-state accuracy.
- Primary files:
  - `lib/github.ts`
  - `types/portfolio.ts`
  - `docs/domains/architecture/system-design.md`
- Deliverables:
  - merged-state enrichment
  - stronger dedupe and pagination consistency
- Done when:
  - sampled usernames show reliable merged/open/closed status
  - ingestion handles large PR histories without duplicates

### Thread C: Contribution Expansion (Issues/Reviews/Comments)

- Branch: `codex/thread-c-contrib-expansion`
- Objective: add non-PR contribution ingestion in API payload.
- Primary files:
  - `lib/github.ts`
  - `types/portfolio.ts`
  - `docs/domains/data/contribution-schema.md`
- Deliverables:
  - issue/review/comment sections in normalized response
- Done when:
  - API returns stable extended payload for at least 3 test users

### Thread D: UI Information Architecture

- Branch: `codex/thread-d-ui-ia`
- Objective: improve readability and exploration flow on portfolio page.
- Primary files:
  - `app/page.tsx`
  - `app/globals.css`
- Deliverables:
  - better grouping/sorting/filtering interaction for contribution sections
- Done when:
  - content density is manageable on desktop and mobile
  - key information can be scanned in under 30 seconds

### Thread E: Branding and Visual System

- Branch: `codex/thread-e-branding`
- Objective: strengthen Openfolio brand consistency across UI.
- Primary files:
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/globals.css`
- Deliverables:
  - brand lockup and visual tokens
  - consistent typography hierarchy
- Done when:
  - page reads clearly as Openfolio at first glance
  - style tokens are reused, not duplicated

### Thread F: Cache and Sync Strategy

- Branch: `codex/thread-f-cache-sync`
- Objective: stabilize seen-user background refresh and fallback behavior.
- Primary files:
  - `lib/seen-users.ts`
  - `app/api/portfolio/[username]/route.ts`
  - `docs/domains/architecture/system-design.md`
- Deliverables:
  - clear TTL/stale policy
  - predictable refresh concurrency rules
- Done when:
  - cache fallback path is deterministic and documented

### Thread G: Tests and CI

- Branch: `codex/thread-g-tests-ci`
- Objective: install baseline quality gate.
- Primary files:
  - `package.json`
  - test files to be added under `tests/` or colocated structure
  - CI workflow files (if introduced)
- Deliverables:
  - API normalization tests
  - minimal end-to-end smoke test
  - CI run for `build + lint + test`
- Done when:
  - PRs fail fast on regressions

### Thread H: Docs and Ops Consistency

- Branch: `codex/thread-h-doc-ops`
- Objective: keep documentation aligned with parallel implementation.
- Primary files:
  - `docs/domains/operations/session-log.md`
  - `docs/domains/delivery/backlog.md`
  - `docs/domains/operations/decision-log.md`
- Deliverables:
  - per-thread progress notes
  - ADR updates when behavior/architecture decisions change
- Done when:
  - docs and code are in sync after each merge

## Merge Order

1. Thread A
2. Thread B and Thread E
3. Thread D and Thread F
4. Thread C
5. Thread G
6. Thread H (continuous; final pass after each merge wave)

## Conflict Risk Map

- High conflict:
  - `types/portfolio.ts` (A, B, C)
  - `lib/github.ts` (B, C)
  - `app/page.tsx` (D, E, C follow-up integration)
- Medium conflict:
  - `docs/domains/architecture/system-design.md` (A, B, F)
  - `docs/domains/delivery/backlog.md` (H with other threads)
- Low conflict:
  - `app/layout.tsx` (mostly E)
  - `lib/seen-users.ts` (mostly F)

## Handoff Template (Use in Every Thread PR)

1. Scope completed:
2. Out-of-scope intentionally skipped:
3. Files changed:
4. Breaking changes:
5. Docs updated:
6. Test/build evidence:

## Suggested Prompt Per Thread

- Include in each new Codex thread kickoff:
  - "Use branch `<branch-name>`. Do only the scope in `docs/plans/active/parallel-workstreams.md` for your thread. Update docs before code changes when behavior changes. Keep commit messages in `<type>: <verb> <object>` format."

## Related Docs

- `AGENTS.md`
- `docs/domains/architecture/system-design.md`
- `docs/domains/delivery/backlog.md`
- `docs/domains/operations/session-log.md`
