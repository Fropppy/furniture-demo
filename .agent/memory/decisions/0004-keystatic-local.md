---
type: project
updated: 2026-10-02
---

# 0004 — Keystatic CMS with local storage; admin is dev-only

## Context

Client will eventually edit content themselves. Requirements: free, no commercial-use
restrictions, git-backed (no DB), works with Astro static. Keystatic chosen over
Decap/Tina: modern UI, git-native, MIT core; Cloud free tier (≤3 users) publishes no
commercial restriction.

## Decision

`storage: { kind: 'local' }` — writes go to the local git working tree, admin at
`/keystatic` exists only in `npm run dev` (integration gated by dev-check/`ENABLE_KEYSTATIC=1`,
ADR 0002's vite work applies). For real client editing later: Keystatic Cloud free tier or
`kind: 'github'` with own OAuth app — a config switch, content stays in the repo either way.

## Consequences

- Deployed static builds have NO admin routes (verified 404) — no attack surface, but also
  no online editing until Cloud/GitHub mode is wired.
- `fields.markdoc({ extension: 'md' })` + `format: { contentField: 'content' }` keep
  compatibility with hand-written `.md` files.
- Dual-schema sync rule (gotchas #4) and quoted dates (gotchas #6) exist because of this.
- User must create the (free) cloud account themselves when that day comes.
