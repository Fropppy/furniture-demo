---
type: reference
updated: 2026-10-02
---

# Glossary — terms and placeholder facts

- **withBase(path)** — `src/lib/site.ts`. Prefixes `import.meta.env.BASE_URL` for all internal
  URLs. Mandatory everywhere (gotchas #3).
- **scene** — one of 8 line-art placeholder illustration types (`src/lib/placeholders.ts`,
  `SCENES`): livingroom, bedroom, kitchen, dining, workspace, lounge, retail, cafe. A project
  picks one `scene` + a `hue` (0–360) for art direction until real photos land.
- **placeholderDataUri(scene, hue, uid)** — returns the SVG as a data URI for lightbox hrefs
  (PhotoSwipe needs real hrefs even for placeholders).
- **CATEGORIES** (`src/lib/site.ts`) — residential, hospitality, office, retail. Keys used by
  content schema enum AND filter UI; keep in sync.
- **STYLE_TAGS** — 6 style keywords; **AREA_BANDS** + `areaBand(area)` — buckets projects into
  size bands for filtering.
- **DEPLOY_TARGET=gh-pages** — env switch flipping site to `fropppy.github.io` and base to
  `/furniture-demo`. Absent → custom-domain mode (`SITE_URL`, base `/`).
- **ENABLE_KEYSTATIC=1** — env switch adding Keystatic integration to a non-dev build.
- **"FORMA Studio"** — placeholder brand (name, tagline, phone, email, address, socials all
  fake) in `src/lib/site.ts`. Replace per client; regenerate `public/og-default.png` via
  `npm run og` afterwards.
- **Reference site** — noithatkendesign.vn: October CMS, PHP 7.2 (EOL), jQuery+Bootstrap+Slick+
  Fancybox. Our benchmark for features (portfolio depth, lead magnets), not for tech.
