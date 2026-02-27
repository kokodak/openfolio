---
id: operations-context-inbox-2026-02-27-project-toggle-image-and-star-sorting
title: Project Toggle Image Rendering and Star-Based Ordering
domain: operations
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - context
  - inbox-entry
  - ux
related:
  - docs/domains/operations/context-inbox.md
  - docs/domains/delivery/backlog.md
  - docs/domains/architecture/system-design.md
---

# 2026-02-27 - Project Toggle Image Rendering and Star-Based Ordering

- Source: discussion
- Decision State: accepted
- Raw Context:
  - User requested that when toggling by project, each project image should be fetched and listed together.
  - User requested ordering the repository list by higher star count for improved relevance.
- Promotion Targets:
  - ADR: TBD
  - Spec/Doc: `docs/domains/architecture/system-design.md`
  - Backlog: `docs/domains/delivery/backlog.md`
- Notes:
  - Behavior scope affects both API response shape and client rendering.
  - Confirmed image intent as repository image (not owner avatar).

## Related Docs

- `docs/domains/operations/context-inbox.md`
- `docs/domains/delivery/backlog.md`
- `docs/domains/architecture/system-design.md`
