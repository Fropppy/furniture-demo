---
type: project
updated: 2026-10-02
---

# 0001 — Astro 5 + Tailwind 4 static output

## Context

Portfolio/gallery site, mostly fixed content, SEO is the top requirement. Reference site
(noithatkendesign.vn) runs October CMS on PHP 7.2 (EOL) with jQuery/Bootstrap — slow and
unmaintainable. Dev machine has no PHP/Composer. Target: 90+ Lighthouse, cheap static
hosting, client-editable content later.

## Decision

Astro 5 (static output, content collections with zod validation) + Tailwind CSS 4 via
`@tailwindcss/vite`, TypeScript strict. No client framework except React where Keystatic
requires it. Tailwind 4 (not 3) for `@theme` token workflow.

## Consequences

- Zero-JS by default; interactivity (PhotoSwipe, Swiper, filters) is island/vanilla-script only.
- Content lives in git as `.md` — needs the dual-schema sync rule (gotchas #4).
- Keystatic pulls in React + the vite pin (ADR 0002) — accepted cost of client editing.
- October CMS path rejected: PHP EOL toolchain on dev machine, worse perf ceiling.
