# Project memory — FORMA Studio (funiture-web-design)

Agent memory for this repo. Index only — read the file a line points to before relying on
it. Update rules live in `AGENTS.md` § Memory protocol. Nothing here may duplicate what
`git log`, the code, or `README.md` already answers.

## State

- [Project state & backlog](state.md) — stack, live demo, deploy status, pre-launch backlog, client context

## Decisions (ADR)

- [0001 — Astro 5 + Tailwind 4 static](decisions/0001-astro-tailwind-static.md) — why not Next.js/WordPress/October CMS
- [0002 — Pin vite 6.4.3 + plugin-react 5.1.4](decisions/0002-pin-vite-6.4.3.md) — dual-vite crash; overrides block is load-bearing
- [0003 — GitHub Pages client demo](decisions/0003-github-pages-demo.md) — Fropppy/furniture-demo, DEPLOY_TARGET switch
- [0004 — Keystatic CMS, local storage](decisions/0004-keystatic-local.md) — dev-only admin, cloud mode deferred
- [0005 — SVG placeholder system](decisions/0005-svg-placeholders.md) — scene/hue line-art until photography arrives

## Gotchas

- [Standing traps](gotchas.md) — vite pin, .nojekyll, withBase, dual-schema sync, Keystatic gating, quoted dates

## Lessons (failed approaches)

- [lessons.md](lessons.md) — errors already hit and why each fix won; do not re-try these paths

## Glossary

- [glossary.md](glossary.md) — domain terms and placeholder-brand facts not derivable from code alone
