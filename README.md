# FORMA Studio — Furniture & Interior Design Portfolio

A gallery-style showcase site for a design company, inspired by
[noithatkendesign.vn](https://noithatkendesign.vn/) but rebuilt on a modern,
faster stack.

## Stack (and why it beats the reference)

| Layer      | KenDesign (reference)          | This project                                    |
| ---------- | ------------------------------ | ----------------------------------------------- |
| Backend    | October CMS (Laravel), PHP 7.2 | None at runtime — **Astro 7** static build      |
| Frontend   | jQuery, Bootstrap, Slick, WOW  | Zero-JS by default + small vanilla islands      |
| Styling    | Bootstrap + custom CSS         | **Tailwind CSS 4** design tokens                |
| Lightbox   | Fancybox                       | **PhotoSwipe 5** (free for commercial use)      |
| CMS        | October CMS admin              | **Keystatic** (git-based, free) at `/keystatic` |
| Sliders    | Slick                          | **Swiper 14** (a11y module, pause control, reduced-motion aware) |
| Fonts      | Google Fonts CDN               | Self-hosted via Fontsource (no 3rd-party calls) |
| Images     | Manual WebP + lazy             | SVG illustrations now; **photo uploads via Keystatic** + Astro responsive image pipeline (WebP/AVIF, srcset) |
| SEO        | Meta + Organization JSON-LD    | Meta, OG, canonical, JSON-LD, sitemap, robots   |
| Deploy     | nginx + PHP host               | Any static host (nginx, `public_html`, Vercel…) |

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:4321 (Keystatic at /keystatic)
npm run check      # type + content-schema diagnostics
npm run build      # astro check + static build → dist/ (build fails on schema errors)
npm run preview    # serve the built site locally
npm run og         # regenerate public/og-default.png (after brand changes)
```

Deploy = upload `dist/` to any web root. No Node/PHP needed on the server.

## Where things live

```
astro.config.mjs        # site/base switching (DEPLOY_TARGET), integrations
keystatic.config.ts     # CMS form definitions (keep in sync with content.config.ts)
scripts/make-og.mjs     # regenerates public/og-default.png (`npm run og`)
src/
├── content.config.ts   # Project & post schemas (frontmatter contract)
├── content/
│   ├── projects/*.md   # ← portfolio entries (add yours here)
│   └── posts/*.md      # journal articles
├── assets/images/      # project photos uploaded via Keystatic (per-slug folders)
├── components/         # Header, Footer, PageHeader, ProjectCard, Placeholder, Seo…
├── layouts/Base.astro  # <head>, scroll-reveal, page shell
├── lib/
│   ├── site.ts         # ← brand name, contacts, form config, categories, helpers
│   └── placeholders.ts # SVG line-art scenes (8 room types × any hue)
├── styles/global.css   # Tailwind theme tokens (cream/clay/ink palette)
└── pages/              # / /projects/ /projects/[slug] /about /contact /journal /rss.xml
docs/
└── huong-dan-nhap-lieu.md  # Vietnamese one-page guide for the client's editor
```

## Editing content — Keystatic CMS

Non-developers edit everything through a form UI instead of touching markdown:

```bash
npm run dev          # then open http://localhost:4321/keystatic
```

- **Local mode (current):** edits write straight to `src/content/…` in your working
  tree — review with `git diff` and commit as usual.
- **Client editing:** switch `storage` to `{ kind: 'cloud' }` in `keystatic.config.ts`
  and connect a project at [keystatic.cloud](https://keystatic.cloud) (free for up to
  3 users). The admin UI then must be deployed with an SSR adapter: install
  `@astrojs/vercel`, add it to `integrations`, build with `ENABLE_KEYSTATIC=1`.
  Static deploys (GitHub Pages) automatically exclude the admin — by design.
- The admin path is `/keystatic` (hardcoded by the integration).
- `keystatic.config.ts` mirrors `src/content.config.ts` — new frontmatter fields go
  in **both** files.
- **Project photos:** each project has a *Cover photo* group and a *Photo gallery*
  array in the admin — upload a file, type the (required) alt text, save. Files land
  in `src/assets/images/projects/<slug>/` and the build turns them into responsive
  WebP with `srcset`. Projects without photos keep the SVG illustrations; alt text
  and image files are enforced by the form. The editor-facing rules live in
  [docs/huong-dan-nhap-lieu.md](docs/huong-dan-nhap-lieu.md) (Vietnamese).

## Contact form — submissions by email

The "Start a project" form on `/contact` sends each enquiry to the studio's **admin
email inbox** via [Web3Forms](https://web3forms.com) (free). Records are then managed
from the inbox (labels/forwarding, or later a Google Sheets webhook — no database).

**One-time setup (needs a human with the admin mailbox):**

1. Open [web3forms.com](https://web3forms.com), enter the admin email, submit — the
   **Access Key** arrives by email.
2. Put it in a `.env` file (copy `.env.example`): `PUBLIC_FORM_ACCESS_KEY=<key>`.
   The key is public-safe by design — it only allows *sending to* your inbox.
3. Restart dev / redeploy. `data-configured="false"` on the form flips to `true`.

Built in: honeypot (`botcheck`) + 3-second time-trap anti-spam, required consent
checkbox (Vietnam PDPD / Decree 13-2023 compliant copy), client-side validation with
`aria-invalid`, `role="status"` success/error messaging, and a graceful
"not configured" fallback that shows the studio's phone/email when no key is set.

## SEO features built in

Per-page titles/descriptions with editor overrides (`seoTitle`/`seoDescription`
frontmatter — blank falls back to the content), canonical URLs, OpenGraph + Twitter
cards with a generated default share image (`npm run og`), `max-image-preview:large`,
Organization / BreadcrumbList / CreativeWork / Article JSON-LD, sitemap (RSS excluded),
`robots.txt`, and an RSS feed at `/rss.xml`.

## Adding a project

Create `src/content/projects/my-project.md`:

```yaml
---
title: My Project
summary: One-sentence summary used in cards, meta description and OG tags.
category: residential   # residential | hospitality | office | retail
style: Japandi
location: Hanoi
area: 180               # m² — drives the floor-area filter
year: 2025
budget: 3 billion VND   # optional
services: [Interior design, Custom furniture]
scene: living           # placeholder scene: living|bedroom|kitchen|dining|office|cafe|lounge|facade
hue: 150                # 0–360 tint so the grid stays varied but cohesive
gallery: [living, dining, bedroom]
# Real photography (optional — falls back to scene/hue illustrations):
# cover:
#   image: ../../assets/images/projects/my-project/cover.jpg
#   alt: Living room with walnut shelving, natural light
#   caption: Optional caption
# photos:
#   - image: ../../assets/images/projects/my-project/0.jpg
#     alt: Kitchen with terrazzo island, seen from the dining table
featured: true          # puts it in the home hero slider
order: 1                # sort order
seoTitle: …             # optional — overrides the page <title> (max 60 chars, enforced)
seoDescription: …       # optional — overrides the meta description (~155 chars)
---

## The brief

Markdown write-up shown on the project page.
```

(Easiest way: run `npm run dev` and add it through `/keystatic`.)

## Project photography (wired)

Cover and gallery photo support is fully wired — no code changes needed to add
photos:

- **Via the admin (intended path):** open `/keystatic` → *Projects* → a project →
  *Cover photo* / *Photo gallery* → **Choose file**, type the alt text, **Save**.
- **Via git:** drop JPGs in `src/assets/images/projects/<slug>/` and reference them
  from frontmatter with paths relative to the entry file (see the example in
  "Adding a project").

Either way the build runs images through `astro:assets`: responsive WebP `srcset`
(`layout="constrained"` site-wide, `full-width` for hero/cover), correct dimensions
(no layout shift), lazy loading, and `fetchpriority="high"` on the first hero slide
and the project cover. `alt` and the image file itself are required (schema-enforced),
and a missing referenced file fails `npm run build` — a deliberate CI gate.
Projects without photos keep the generated SVG illustrations everywhere (ADR 0005),
and the illustration gallery on the detail page is replaced by the photo gallery
only when at least one photo exists.

## Deploy

The site builds to plain static HTML and can be deployed anywhere.

**Live demo (GitHub Pages):** https://fropppy.github.io/furniture-demo/

**Automatic (current setup):** every push to `main` runs
[.github/workflows/deploy.yml](.github/workflows/deploy.yml) — `astro check`, a
`DEPLOY_TARGET=gh-pages` build, and a deploy of `dist/` to the `gh-pages` branch
(`.nojekyll` handled by the action). Add `PUBLIC_FORM_ACCESS_KEY` as a repo secret
under *Settings → Secrets and variables → Actions* so the deployed form sends email.

**Manual fallback** (if Actions is disabled):

```bash
npm run check
DEPLOY_TARGET=gh-pages npm run build            # subpath build for GitHub Pages
# push dist/ to the gh-pages branch, including a dist/.nojekyll file
```

The `DEPLOY_TARGET=gh-pages` switch sets `site`/`base` in `astro.config.mjs`;
all internal links go through `withBase()` in `src/lib/site.ts` so both targets work.

**Vercel (proper project, stable `<name>.vercel.app` domain):** the repo is at
[github.com/Fropppy/furniture-demo](https://github.com/Fropppy/furniture-demo) — open
[vercel.com/new](https://vercel.com/new) and import it; Vercel auto-detects Astro
(build `npm run build`, output `dist`, no adapter or `vercel.json` needed). Then set
`SITE_URL` in `astro.config.mjs` to the final domain and redeploy. CLI alternative:
create a token at [vercel.com/account/settings/tokens](https://vercel.com/account/settings/tokens), then
`npx vercel link --yes --project furniture-demo && npx vercel --prod --yes --token $VERCEL_TOKEN`.
Note: Vercel's free Hobby plan restricts commercial use — fine for a demo, use Pro for the live client site.

## Before launch

- [ ] Set the real domain in `astro.config.mjs` (`SITE_URL`) and `public/robots.txt`
- [ ] Update brand/contacts in `src/lib/site.ts` **and** the `BRAND` block in `scripts/make-og.mjs`, then `npm run og`
- [ ] Create the Web3Forms access key (see "Contact form") and set it in `.env` + the repo Actions secret
- [ ] Upload real project photography via `/keystatic` (schema ready — see "Project photography")
- [ ] Add GA4 / Meta Pixel / Zalo–Messenger chat snippets in `Base.astro`

## Roadmap ideas (mirroring the reference, when needed)

- VI/EN i18n routing (`astro:i18n`)
- Investment / break-even calculators (the reference's lead magnets)
- Journal post covers via the same image() schema pattern (projects are done)
- Dynamic lead widgets (Zalo, Messenger, WhatsApp float)
