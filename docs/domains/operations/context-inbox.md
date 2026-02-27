---
id: operations-context-inbox
title: Context Inbox
domain: operations
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - context
  - inbox
  - ideas
related:
  - AGENTS.md
  - docs/domains/operations/decision-log.md
  - docs/domains/operations/session-log.md
  - docs/domains/delivery/backlog.md
  - docs/domains/operations/context-inbox/2026-02-27-preserve-raw-discussion-context.md
---

# Context Inbox

Store raw and minimally processed conversation context so future ideation and planning can reuse original intent.

## Capture Policy

- Keep entries close to original wording whenever possible.
- Record source channel (idea, inbox, discussion, follow-up).
- Track decision state explicitly (`open`, `accepted`, `rejected`, `deferred`).
- Link promoted outcomes to ADRs, specs, backlog items, or implementation PRs.
- Do not replace this inbox with summaries only; keep both raw notes and promoted artifacts.
- Sanitize secrets and credentials before writing entries (for example, replace with `[REDACTED_API_KEY]`).

## Entry File Policy

- Store entries in `docs/domains/operations/context-inbox/`.
- Use one file per entry.
- Filename format: `YYYY-MM-DD-short-kebab-title.md`.
- Include frontmatter in each entry file for retrieval and linking.

## Entry Template

```md
---
id: operations-context-inbox-YYYY-MM-DD-short-title
title: <Entry Title>
domain: operations
status: active
source_of_truth: true
last_updated: YYYY-MM-DD
owners:
  - human
  - agent
tags:
  - context
  - inbox-entry
related:
  - docs/domains/operations/context-inbox.md
---

# YYYY-MM-DD - Entry Title

- Source: idea | inbox | discussion | follow-up
- Decision State: open | accepted | rejected | deferred
- Raw Context:
  - <original note 1, sanitized if sensitive>
  - <original note 2, sanitized if sensitive>
- Promotion Targets:
  - ADR: <path or TBD>
  - Spec/Doc: <path or TBD>
  - Backlog: <item or TBD>
- Notes:
  - <optional interpretation constraints and sanitization notes>
```

## Entry Index

- `docs/domains/operations/context-inbox/2026-02-27-preserve-raw-discussion-context.md`

## Related Docs

- `AGENTS.md`
- `docs/domains/operations/decision-log.md`
- `docs/domains/operations/session-log.md`
- `docs/domains/delivery/backlog.md`
- `docs/domains/operations/context-inbox/2026-02-27-preserve-raw-discussion-context.md`
