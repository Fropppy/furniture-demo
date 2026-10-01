# FORMA Studio — Furniture & Interior Design Portfolio

A gallery-style showcase site for a design company, inspired by
[noithatkendesign.vn](https://noithatkendesign.vn/) but rebuilt on a modern,
faster stack.

## Stack (and why it beats the reference)

| Layer      | KenDesign (reference)          | This project                                    |
| ---------- | ------------------------------ | ----------------------------------------------- |
| Backend    | October CMS (Laravel), PHP 7.2 | None at runtime — **Astro 5** static build      |
| Frontend   | jQuery, Bootstrap, Slick, WOW  | Zero-JS by default + small vanilla islands      |
| Styling    | Bootstrap + custom CSS         | **Tailwind CSS 4** design tokens                |
| Lightbox   | Fancybox                       | **PhotoSwipe 5** (free for commercial use)      |
| Sliders    | Slick                          | **Swiper 11**                                   |
| Fonts      | Google Fonts CDN               | Self-hosted via Fontsource (no 3rd-party calls) |
| Images     | Manual WebP + lazy             | SVG placeholder system now; Astro image pipeline for photos |
| SEO        | Meta + Organization JSON-LD    | Meta, OG, canonical, JSON-LD, sitemap, robots   |
| Deploy     | nginx + PHP host               | Any static host (nginx, `public_html`, Vercel…) |

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # static site → dist/
npm run preview    # serve the built site locally
```

Deploy = upload `dist/` to any web root. No Node/PHP needed on the server.

## Where things live

```
src/
├── content.config.ts     # Project & post schemas (frontmatter contract)
├── content/
│   ├── projects/*.md     # ← portfolio entries (add yours here)
│   └── posts/*.md        # journal articles
├── components/           # Header, Footer, ProjectCard, Placeholder, Seo…
├── layouts/Base.astro    # <head>, scroll-reveal, page shell
├── lib/
│   ├── site.ts           # ← brand name, contacts, categories, area bands
│   └── placeholders.ts   # SVG line-art scenes (8 room types × any hue)
├── styles/global.css     # Tailwind theme tokens (cream/clay/ink palette)
└── pages/                # / /projects/ /projects/[slug] /about /contact /journal
```

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
featured: true          # puts it in the home hero slider
order: 1                # sort order
---

## The brief
Markdown write-up shown on the project page.
```

## Replacing placeholders with photos

Gallery images are generated SVG line-art (`src/lib/placeholders.ts`) so the
site is complete and license-clean on day one. To switch to photography:

1. Drop photos in `src/assets/projects/<slug>/`.
2. In the project frontmatter, replace `scene`/`hue`/`gallery` with image
   paths and render them through `astro:assets` (`<Image />`) — you get
   AVIF/WebP, responsive `srcset` and lazy loading at build time.

## Before launch

- [ ] Set the real domain in `astro.config.mjs` (`SITE_URL`) and `public/robots.txt`
- [ ] Update brand/contacts in `src/lib/site.ts`
- [ ] Wire the contact form (`src/pages/contact.astro`) to Formspree/GetResponse/your API
- [ ] Replace placeholder art with project photography
- [ ] Add GA4 / Meta Pixel / Zalo–Messenger chat snippets in `Base.astro`

## Roadmap ideas (mirroring the reference, when needed)

- VI/EN i18n routing (`astro:i18n`)
- Investment / break-even calculators (the reference's lead magnets)
- Decap or Sveltia CMS on top of the git-based content for non-dev editing
- Dynamic lead widgets (Zalo, Messenger, WhatsApp float)
