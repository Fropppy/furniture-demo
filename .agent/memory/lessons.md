---
type: feedback
updated: 2026-10-02
---

# Lessons — failed approaches, do not re-try

Each entry: what was tried, exact failure, what worked instead.

- **Letting npm resolve vite freely with Keystatic installed.** npm hoisted vite 8.3.2 for
  `@vitejs/plugin-react@6` while Astro 5.18 needs vite 6.4.3 → `Missing field 'moduleType'`
  from `builtin:vite-react-refresh-wrapper`. Fix: overrides pin (ADR 0002). Do not "fix" by
  upgrading Astro or plugin-react casually — re-derive the pin pair first.

- **Routing `@keystatic/astro` through esbuild dep optimization.** `Could not resolve
  "astro:env/server"` blocked the admin UI in dev. Fix: `vite.ssr.noExternal` +
  `vite.optimizeDeps.exclude` for `@keystatic/astro` in astro.config.mjs.

- **`sharp().toFile(new URL(...))`** → `Missing output file path`. Wrap with `fileURLToPath()`.

- **Plain CSS class + `@apply` in Tailwind 4** (`Cannot apply unknown utility class 'btn'`).
  Fix: `@utility btn { @apply ... }` in global.css. Tailwind 4 has no `@layer components`
  escape hatch the v3 way.

- **Refactoring `Base.astro` head into `Seo.astro`** dropped `<slot name="seo" />` once —
  per-page JSON-LD silently vanished. Keep the named slot whenever touching the head.

- **Saving a Keystatic entry just to test the form** normalized hand-written frontmatter
  (quoting/layout diffs). Verify forms by opening the editor, not by saving seeded content.

- **Vercel anonymous deploy as client demo** (`vercel deploy --temporary`): URL expires ~1h,
  Hobby plan bans commercial use. Usable for a 1-hour look only; permanent demo is gh-pages
  (ADR 0003).

- **`pkill -f "astro dev"`** killed its own compound shell command (self-match). See gotchas #8.
