---
id: std-linking
title: Document Linking Standard
domain: operations
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - agent
tags:
  - standard
  - links
related:
  - docs/standards/frontmatter.md
  - ARCHITECTURE.md
---

# Document Linking Standard

## Goals

- Make related context discoverable in one hop.
- Keep navigation stable after refactors.

## Rules

- Every doc must include a `related` field in frontmatter.
- Every doc should include a `## Related Docs` section at the end.
- Prefer linking to domain hub docs for broad context.
- Do not use local absolute filesystem paths.
- Use repository-relative paths in docs.
- Use GitHub URLs in assistant/user-facing responses when remote is configured.
- If a tooling environment requires local absolute file paths for clickable references, treat that as an explicit response-format exception.
- If remote is missing, use repository-relative paths and request remote setup.

## GitHub URL Format

- Preferred: `https://github.com/<owner>/<repo>/blob/<branch>/<path>#L<line>`
- Example: `https://github.com/acme/openfolio/blob/main/docs/README.md#L1`

## Link Maintenance

- When moving a document, update all inbound links in the same change.
- If replacing a document, keep a short redirect note in the old file when practical.
- When remote/branch changes, refresh generated GitHub links.

## Related Docs

- `docs/standards/frontmatter.md`
- `AGENTS.md`
- `ARCHITECTURE.md`
