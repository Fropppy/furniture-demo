---
type: project
updated: 2026-10-02
---

# Project state & backlog

## What this is

Gallery-style portfolio site for a Vietnamese furniture/interior design company,
modeled on noithatkendesign.vn (October CMS / PHP 7.2 — see ADR 0001). Built to be
resold: the user is the developer, the site goes to paying clients.

## Current status (2026-10-02)

- Stack: Astro 5 static + Tailwind 4 + TypeScript strict + Keystatic CMS. See README for full feature list.
- Live client demo: https://fropppy.github.io/furniture-demo/ (verified 200 on pages/CSS/RSS/OG; `/keystatic` correctly 404s in prod builds).
- Demo repo: GitHub `Fropppy/furniture-demo` — `main` = source, `gh-pages` branch = built output of `dist/`.
- CMS: Keystatic works in `npm run dev` at `/keystatic`; 9 projects + 3 posts seeded. `storage: local` — cloud/GitHub mode deferred until client editing is needed (ADR 0004).
- All placeholders: brand "FORMA Studio", VN phone/email/address in `src/lib/site.ts` are fake and must be replaced per client.

## Pre-launch backlog (blocks real handoff)

1. Real domain: `SITE_URL` in `astro.config.mjs` + `public/robots.txt` sitemap line.
2. Real brand + contacts in `src/lib/site.ts`; regenerate OG image after (`npm run og`).
3. Contact form posts nowhere — wire a backend (Formspree/Netlify Forms/self-host).
4. Replace SVG placeholders with real photography (keep the scene/hue system for art direction).
5. Analytics/chat widgets (GA4, Zalo/Slots chat) — client decision.
6. Optional: VI/EN i18n, price calculators (roadmap ideas in README).
7. **Dependency upgrades (health check 2026-10-02, supersede the old "14 warnings" note):**
   - swiper 11.2.10 → 14.3.0 — **critical** prototype pollution (GHSA-hmx5-qpq5-p643). Swiper
     IS used (hero carousel, `src/pages/index.astro`, Autoplay/EffectFade/Pagination). Fix =
     major upgrade; hero uses stable core API, low migration risk. Do before client handoff.
   - astro 5.18.2 → 7.3.5 — 10 advisories (mixed XSS/SSRF/RCE), all in SSR/islands/View
     Transitions/AVIP-optimization features this static site doesn't exercise today. Real
     exposure ≈ none now, but becomes real when astro:assets processes client photos or SSR
     lands. Fix = breaking major; gate on Keystatic×Astro-7 compatibility + re-derive the
     vite overrides pair (ADR 0002) first. Plan as a dedicated task, never `audit fix --force`.
   - sharp (bundled by Astro) — high, libvips/libheif CVEs; build-time-only on our own images
     today. Resolves with the Astro upgrade.
   - esbuild — Windows dev-server file read only; we're Linux, n/a.
   - `npm audit fix --force` would jump both majors at once and break Keystatic — forbidden.

## Tooling notes

- `@astrojs/check` + `typescript` installed as devDeps 2026-10-02 (`npx astro check`):
  0 errors, 0 warnings, 2 hints — both dead code in `src/components/ProjectCard.astro`
  (unused `eager` prop never passed by any caller; unused `AreaBand` type import). Trivial
  cleanup, safe to do opportunistically.

## Client/commercial context

- VN outsourcing market for this scope: 15–50M VND build, ~1.5–7M VND/yr running (researched 2025-26).
- Vercel Hobby plan bans commercial use — the client production deploy must be GitHub Pages (fine for static), a paid host, or a proper Vercel Pro/team account.
- Keystatic licensing is settled: MIT core, Cloud free tier has no commercial-use restriction, no lock-in (content lives in the client's GitHub repo).

## Open offers awaiting user go-ahead

- Astro middleware login gate on `/keystatic` for a future SSR deploy.
- Proper Vercel project (user must import repo at vercel.com/new with their account).
- Keystatic Cloud wiring when client self-editing starts (user creates the free account).
