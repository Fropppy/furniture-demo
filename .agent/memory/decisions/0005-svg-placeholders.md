---
type: project
updated: 2026-10-02
---

# 0005 — Programmatic SVG placeholders until photography

## Context

No client photography yet. Site needs full visual completeness for demos NOW; waiting on
real images would block everything.

## Decision

`src/lib/placeholders.ts` generates line-art SVG per `scene` (8 types) tinted by `hue`
(0–360), served as data URIs; each content entry stores `scene` + `hue` instead of image
paths. OG share image generated at build-time by `scripts/make-og.mjs` (sharp, 1200×630).

## Consequences

- Swapping in real photos later = replace hrefs in the two collection page templates +
  add `gallery` entries; the scene/hue fields then become pure art-direction metadata.
- PhotoSwipe requires real hrefs — placeholders ship as data URIs so the lightbox works
  in demos.
- `npm run og` must be re-run after any brand change (see state.md backlog item 2).
