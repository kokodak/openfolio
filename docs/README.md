---
id: docs-root
title: Documentation Hub
domain: operations
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - docs
  - navigation
related:
  - AGENTS.md
  - ARCHITECTURE.md
  - docs/standards/frontmatter.md
---

# Documentation Hub

This directory is organized by domain to keep retrieval predictable for agents.

## Domains

- Product: `docs/domains/product/README.md`
- Architecture: `docs/domains/architecture/README.md`
- Data: `docs/domains/data/README.md`
- Delivery: `docs/domains/delivery/README.md`
- Operations: `docs/domains/operations/README.md`

## Standards

- Frontmatter schema: `docs/standards/frontmatter.md`
- Cross-linking rules: `docs/standards/linking.md`

## Active Plans

- Parallel workstreams: `docs/plans/active/parallel-workstreams.md`

## Update Rule

When a feature changes behavior:

1. Update relevant domain docs first.
2. Confirm scope with the user.
3. Implement code.
4. Update logs and backlog.
