---
id: data-contribution-schema-v1
title: Contribution Schema v1
domain: data
status: draft
source_of_truth: false
last_updated: 2026-02-27
owners:
  - agent
tags:
  - schema
  - github
related:
  - docs/domains/architecture/system-design.md
  - docs/domains/delivery/backlog.md
---

# Contribution Schema v1

## Purpose

Define a normalized representation of GitHub contributions for portfolio rendering.

## Core Entities

- `users`
- `repositories`
- `contributions`
- `contribution_events`
- `portfolio_snapshots`

## Contribution Record (Draft)

- `id`
- `user_id`
- `repo_id`
- `kind`: `pull_request | issue | review | commit | discussion`
- `title`
- `url`
- `state`
- `merged_at`
- `created_at`
- `updated_at`
- `impact_score`
- `skills`: string list
- `evidence`: reference list (links, comments, review artifacts)

## Assumptions

- MVP prioritizes public data only.
- Score quality will start heuristic and improve iteratively.

## Related Docs

- `docs/domains/architecture/system-design.md`
- `docs/domains/delivery/backlog.md`

