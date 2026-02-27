---
id: operations-decision-log
title: Decision Log (ADR)
domain: operations
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - human
  - agent
tags:
  - adr
  - decisions
related:
  - AGENTS.md
  - ARCHITECTURE.md
  - docs/domains/operations/session-log.md
---

# Decision Log (ADR)

Record technical and product decisions in the format below.

---

## ADR-0001: Adopt Document-Centric Agent Operations

- Date: 2026-02-27
- Status: Accepted

### Context

Agent-driven development required lower context loss and a repeatable execution loop.

### Decision

Use `docs/` as the operational memory system and persist key decisions and work logs as files.

### Consequences

- Pros: better traceability, faster onboarding, stronger execution continuity
- Cons: additional documentation overhead

---

## ADR-0002: Enforce English-Only Project Language

- Date: 2026-02-27
- Status: Accepted

### Context

Openfolio targets global users, and mixed-language documentation reduces agent and team readability.

### Decision

Standardize all project text artifacts in English, including Markdown documentation, logs, and code comments.

### Consequences

- Pros: consistent global readability, lower context-switching cost, easier agent operation
- Cons: translation overhead when source notes are written in other languages

---

## ADR-0003: Adopt Harness-Style Doc Topology and Metadata

- Date: 2026-02-27
- Status: Accepted

### Context

The project needs fast context retrieval for agents, strong cross-document discoverability, and a stable discuss-to-spec-to-code workflow.
Reference: https://openai.com/index/harness-engineering/

### Decision

Adopt a harness-style documentation system:

- Root control files (`AGENTS.md`, `ARCHITECTURE.md`) as entry points.
- Domain-based docs under `docs/domains/*`.
- Mandatory frontmatter + related links for cross-navigation.
- Feature gate: discuss with user, update docs, then implement code.

### Consequences

- Pros: faster retrieval, lower context drift, reproducible execution workflow
- Cons: more discipline required for metadata/link maintenance

---

## ADR-0004: Decision Authority and Agent Role Separation

- Date: 2026-02-27
- Status: Accepted

### Context

The project requires clear governance to prevent autonomous drift while still benefiting from proactive agent suggestions.

### Decision

Adopt explicit role separation:

- User is the final decision-maker.
- Agent proposes recommendations with rationale and trade-offs.
- Agent must confirm unresolved decisions before implementation.
- Agent must re-check `AGENTS.md` before substantial tasks.

### Consequences

- Pros: tighter alignment, less scope drift, clearer accountability
- Cons: occasional pauses while waiting for user decisions

---

## ADR-0005: Ban Local Path References and Prefer GitHub Links

- Date: 2026-02-27
- Status: Accepted

### Context

Local filesystem paths are not portable and leak environment-specific details in collaboration artifacts.

### Decision

- Do not include local absolute file paths in docs or assistant responses.
- Use GitHub links for user-facing file references when remote is configured.
- Use repository-relative paths as fallback until remote is configured.

### Consequences

- Pros: portable references, cleaner collaboration context, better external readability
- Cons: requires remote metadata for full URL generation

---

## ADR-0006: Agent-Driven Commit Convention and Boundary Recommendation

- Date: 2026-02-27
- Status: Accepted

### Context

The project needs consistent commit quality and predictable history while keeping delivery velocity in agent-driven execution.

### Decision

- The agent commits completed coherent change units.
- Use commit title format: `<type>: <verb> <object/intent>`.
- Keep commits scoped to one concern.
- The agent should proactively recommend when the current work reaches a commit boundary.

### Consequences

- Pros: cleaner history, easier rollback, clearer release notes
- Cons: slightly more overhead to split work into coherent units

## Related Docs

- `AGENTS.md`
- `ARCHITECTURE.md`
- `docs/domains/operations/session-log.md`
