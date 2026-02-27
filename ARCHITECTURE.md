---
id: architecture-root
title: Openfolio Architecture Map
domain: architecture
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - harness-engineering
  - navigation
related:
  - AGENTS.md
  - docs/README.md
  - docs/domains/architecture/system-design.md
---

# Openfolio Architecture Map

This file is the shortest path to relevant project context.

## Layered Model

1. Product Intent
2. System Architecture
3. Data Contracts
4. Delivery Plan
5. Operations Memory

## Domain Hubs

- Product: `docs/domains/product/README.md`
- Architecture: `docs/domains/architecture/README.md`
- Data: `docs/domains/data/README.md`
- Delivery: `docs/domains/delivery/README.md`
- Operations: `docs/domains/operations/README.md`

## Current Primary Flow

1. User provides GitHub username.
2. Ingestion collects contribution signals.
3. Analysis normalizes and scores contributions.
4. Rendering composes portfolio views.
5. Delivery serves shareable pages and APIs.

## Decision Gate

Before implementing any new feature:

1. Discuss with user.
2. Update domain docs/specs.
3. Implement.
4. Log outcomes in operations docs.

