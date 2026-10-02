---
type: project
updated: 2026-10-02
---

# Standing traps — read before touching these areas

1. **package.json `overrides` block is load-bearing.** `"vite": "6.4.3"`, `"@vitejs/plugin-react": "5.1.4"`.
   Removing/upgrading it breaks `astro dev` with `Missing field 'moduleType'` (dual-vite conflict —
   ADR 0002). If a `npm install` bumps vite silently, restore the pin.

2. **`.nojekyll` is not in `public/`.** It exists only in built `dist/` and must be (re)created
   before every gh-pages push — build wipes `dist/`. Without it GitHub's Jekyll hides `_astro/`
   and all CSS 404s.

3. **Every internal link/asset URL goes through `withBase()`** (`src/lib/site.ts`). The gh-pages
   deploy serves under `/furniture-demo/`; a raw `/projects/...` href works locally and breaks
   in the demo. Applies to canonical/OG URLs and JSON-LD too.

4. **Dual-schema sync rule:** `keystatic.config.ts` must mirror the zod schemas in
   `src/content.config.ts`. Change both or the CMS form and the build validator diverge.

5. **Keystatic is gated out of static builds** (`astro.config.mjs`: enabled when `dev` or
   `ENABLE_KEYSTATIC=1`). Its routes are `prerender: false` and would break a static build.
   Never add the integration unconditionally.

6. **Frontmatter dates are quoted** (`date: '2025-08-12'`) for Keystatic's js-yaml writer.
   Keep new entries quoted the same way.

7. **`seoTitle`/`seoDescription` are blank-tolerant by design** — `z.preprocess` turns `''`
   into `undefined` so page-level fallbacks apply. Do not "tighten" those schemas to reject
   empty strings; Keystatic submits blanks for untouched fields.

8. **Killing the dev server: `fuser -k 4321/tcp`.** `pkill -f "astro dev"` matches the calling
   shell's own command line and kills the compound command itself.

9. **`robots.txt` hardcodes the demo sitemap URL** — update together with `SITE_URL` at launch
   (see state.md backlog item 1).
