---
id: std-frontmatter
title: Frontmatter Standard
domain: operations
status: active
source_of_truth: true
last_updated: 2026-02-27
owners:
  - agent
tags:
  - standard
  - metadata
related:
  - docs/standards/linking.md
  - docs/README.md
---

# Frontmatter Standard

All persistent docs under `docs/` should start with YAML frontmatter.

## Required Fields

- `id`: globally unique and stable identifier
- `title`: document title
- `domain`: one of `product | architecture | data | delivery | operations`
- `status`: `draft | active | deprecated`
- `last_updated`: `YYYY-MM-DD`
- `owners`: list of `human` and/or `agent`
- `related`: repository-relative paths (not local absolute filesystem paths)

## Optional Fields

- `source_of_truth`: `true | false`
- `tags`: list of searchable tags
- `supersedes`: id of replaced document

## Example

```yaml
---
id: data-contribution-schema-v1
title: Contribution Schema v1
domain: data
status: draft
last_updated: 2026-02-27
owners:
  - agent
related:
  - docs/domains/architecture/system-design.md
---
```
