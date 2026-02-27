# Openfolio Agents Guide

This file is the execution harness for agent-driven delivery.

## Purpose

- Build Openfolio as a global product that turns GitHub contributions into portfolio assets.
- Keep every important decision discoverable through structured documentation.
- Treat documentation as part of the runtime for agents, not as passive notes.

## Mandatory Policy

- Use English for all artifacts: docs, plans, logs, comments, and commit messages.
- Use frontmatter for every document under `docs/` (except optional scratch notes).
- Keep links current whenever files move or are renamed.
- Sanitize sensitive data before storing or responding (API keys, tokens, secrets, passwords, private credentials).
- Never use local absolute filesystem paths in documents or responses.
- Use GitHub links for file references whenever repository remote is configured.
- If remote is not configured yet, use repo-relative paths as a temporary fallback.

## Commit Policy

- The agent performs commits when a coherent unit of change is complete.
- Commit message format: `<type>: <verb> <object/intent>`.
- Start message body with an English verb phrase (for example, `feat: add ...`, `fix: resolve ...`, `docs: define ...`).
- Recommended types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Do not mix unrelated changes in one commit.
- Before committing, provide a short recommendation that the current change is at commit boundary.

## Governance

- The user makes final decisions.
- The agent provides options, trade-offs, and recommendations.
- The agent must not treat assumptions as decisions.
- If a decision is missing, stop implementation and ask for a decision.

## Navigation

- System map: `ARCHITECTURE.md`
- Docs hub: `docs/README.md`
- Frontmatter standard: `docs/standards/frontmatter.md`
- Linking standard: `docs/standards/linking.md`

## Feature Delivery Workflow (Gated)

1. Discuss the feature with the user first.
2. Convert the discussion into updated docs/specs.
3. Get explicit user confirmation when scope or behavior changed.
4. Implement code based on the approved docs.
5. Sync docs after implementation (what changed, why, test results).

Do not skip step 1 for new features. Do not skip step 2 for behavior changes.

## Source-Of-Truth Priority

1. `docs/domains/operations/decision-log.md`
2. `ARCHITECTURE.md`
3. `docs/domains/architecture/system-design.md`
4. `docs/domains/delivery/backlog.md`
5. Other docs

## Change Discipline

- Record irreversible decisions as ADRs.
- Record execution history in session logs.
- Capture raw ideas and inbox-style discussion context in the context inbox document before summarizing.
- Keep backlog statuses aligned with actual implementation state.
- If code and docs disagree, either fix the code or update docs in the same task.

## Anti-Drift Checklist

Before substantial work, verify:

1. Relevant sections of `AGENTS.md` were re-read.
2. The task is mapped to domain docs.
3. Decision owner is clear (user).
4. Current work follows discuss -> docs -> implement.
