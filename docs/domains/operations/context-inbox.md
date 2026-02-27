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
---

# Context Inbox

Store raw and minimally processed conversation context so future ideation and planning can reuse original intent.

## Capture Policy

- Keep entries close to original wording whenever possible.
- Record source channel (idea, inbox, discussion, follow-up).
- Track decision state explicitly (`open`, `accepted`, `rejected`, `deferred`).
- Link promoted outcomes to ADRs, specs, backlog items, or implementation PRs.
- Do not replace this inbox with summaries only; keep both raw notes and promoted artifacts.

## Entry Template

```md
## YYYY-MM-DD - Entry Title

- Source: idea | inbox | discussion | follow-up
- Decision State: open | accepted | rejected | deferred
- Raw Context:
  - <original note 1>
  - <original note 2>
- Promotion Targets:
  - ADR: <path or TBD>
  - Spec/Doc: <path or TBD>
  - Backlog: <item or TBD>
- Notes:
  - <optional interpretation constraints>
```

## Entries

## 2026-02-27 - Preserve Raw Discussion Context for Future Ideation

- Source: discussion
- Decision State: accepted
- Raw Context:
  - User asked to keep a document that stores unrefined idea/inbox discussion data so context is not lost.
  - Purpose is to let the agent reference prior raw context for later idea proposals.
- Promotion Targets:
  - ADR: `docs/domains/operations/decision-log.md` (ADR-0008)
  - Spec/Doc: `AGENTS.md`, `docs/domains/operations/README.md`
  - Backlog: N/A (operations process update)
- Notes:
  - The inbox is additive and does not replace ADR/session/backlog documentation.

## Related Docs

- `AGENTS.md`
- `docs/domains/operations/decision-log.md`
- `docs/domains/operations/session-log.md`
- `docs/domains/delivery/backlog.md`
