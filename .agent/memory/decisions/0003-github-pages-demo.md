---
type: project
updated: 2026-10-02
---

# 0003 — GitHub Pages as the permanent client demo

## Context

User needs a stable URL to show clients; has no Vercel account; Vercel Hobby bans
commercial use; anonymous `vercel deploy --temporary` URLs expire (~1h). Has GitHub
("Fropppy", gh CLI authed, SSH).

## Decision

Public repo `Fropppy/furniture-demo`: `main` = source, `gh-pages` branch = contents of
`dist/` built with `DEPLOY_TARGET=gh-pages npm run build` (site → fropppy.github.io,
base → `/furniture-demo`). Live at https://fropppy.github.io/furniture-demo/.
`dist/.nojekyll` required on every push (gotchas #2).

## Consequences

- All internal URLs must use `withBase()` so the same source serves `/` and
  `/furniture-demo/` (gotchas #3).
- Demo ≠ production: no Keystatic, no form backend. Production for a client = custom domain
  static host or paid Vercel; `astro.config.mjs` `SITE_URL` switch already exists.
- Jekyll trap learned the hard way: missing `.nojekyll` = all CSS 404.
