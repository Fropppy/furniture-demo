# AGENTS.md

Instructions for AI coding agents working in this repo (Astro 5 + Tailwind 4 furniture
portfolio site, "FORMA Studio" placeholder brand). Human-facing docs live in `README.md`;
this file is the agent complement. Non-obvious project facts live in `.agent/memory/`.

## Project memory protocol — MANDATORY

1. **At session start, read `.agent/memory/MEMORY.md` before planning anything.** This is
   initialization, not optional. Follow its pointers into detail files when they are
   relevant to your task.
2. **A task that modified tracked files is not complete until memory is updated.** Treat
   this like "tests pass": finish = code + memory, in the same pass.
3. **Update, don't append-around.** If your change makes an existing memory line wrong,
   rewrite or delete that line in the same edit. Stale memory is worse than missing memory.
4. **New decision between ≥2 viable options → new ADR** at
   `.agent/memory/decisions/NNNN-slug.md` (next free number, Context/Decision/Consequences,
   frontmatter `updated:` = today), and add its one-line index entry to `MEMORY.md`.
5. **Failed approach with a real error → record it** in `.agent/memory/lessons.md` with the
   exact error string and the fix that won, so no session re-tries it.
6. **New standing trap → `.agent/memory/gotchas.md`.** Anything a future session would hit
   without warning (env quirks, ordering constraints, silent breakage).
7. **Status shifts (deploy, backlog, client facts) → `.agent/memory/state.md`**; new domain
   terms or placeholder-brand facts → `glossary.md`.
8. **Never store** what `git log`, the code, or `README.md` already answers; no task
   narrations, no file-level trivia, no secrets (phones/emails/keys — placeholder-brand
   facts excepted, they are in `glossary.md` by design).
9. **Keep `MEMORY.md` an index**: one line per file, ≤ 40 lines total. Detail goes in the
   detail files, never the index.
10. **Memory is local-only.** `.gitignore` excludes all hidden dirs (`.*/`) — `.agent/` never
    gets committed or pushed. Never force-add it (`git add -f`). After cloning the repo on a
    new machine, agent memory does not exist yet — seed it from `README.md` + first-session
    exploration, using the layout described above.

## Hard invariants — do not break

- `package.json` `overrides` block currently holds `"sharp": "0.35.5"` only (since the
  Astro 7 upgrade, ADR 0007). Drop it when Astro's own sharp dep reaches ≥0.35.5; never
  re-add vite/plugin-react pins.
- Every internal link, asset, canonical, OG, and JSON-LD URL goes through `withBase()`
  (`src/lib/site.ts`). Raw `/...` hrefs break the gh-pages demo base path.
- `keystatic.config.ts` mirrors `src/content.config.ts` zod schemas — style options and
  bounds come from the shared `STYLE_TAGS`/`site.ts` constants. Change both, always.
- Keystatic integration stays gated (dev / `ENABLE_KEYSTATIC=1`). Never unconditional —
  its routes are `prerender: false` and break static builds.
- Frontmatter dates in `src/content/` are quoted strings (Keystatic js-yaml compat).
- Deploys run through CI (`.github/workflows/deploy.yml`); if doing a manual gh-pages
  push, recreate `dist/.nojekyll` after build (build wipes `dist/`).

## Commands

```bash
npm run dev                            # dev server :4321, Keystatic at /keystatic
npm run check                          # astro check (types + content schemas)
npm run build                          # astro check + production build (custom-domain mode)
DEPLOY_TARGET=gh-pages npm run build   # build for fropppy.github.io/furniture-demo
ENABLE_KEYSTATIC=1 npm run build       # build WITH Keystatic routes (non-prod only)
npm run preview                        # serve dist/
npm run og                             # regenerate public/og-default.png (after brand changes)
fuser -k 4321/tcp                      # kill dev server (never `pkill -f "astro dev"` — self-matches)
```

## MCP tools — use them, don't freehand

MCP servers are connected in this environment. Reach for the right one instead of guessing:

- **context7** — BEFORE writing against any library API (Astro, Tailwind 4, Keystatic, sharp,
  PhotoSwipe, Swiper): `resolve-library-id` then `query-docs`. Version-specific APIs
  (Tailwind 4 `@utility`, Astro 5 content config) are where wrong-from-memory code comes from.
- **serena** — for refactors and multi-file symbol work: `find_symbol` /
  `find_referencing_symbols` instead of grep-guessing; `get_diagnostics_for_file` on every
  touched `.ts`/`.astro` file BEFORE declaring a task done. Run `replace_in_files` dry-run
  first for bulk edits.
- **zai-mcp-server** — after any visual/UI change: screenshot the rendered page and run
  `ui_diff_check`/`analyze_image` rather than judging from code. Also `extract_text_from_screenshot`
  when transcribing client screenshots into content.
- **zread** — reading upstream repos (withastro/astro, keystaticjs/keystatic) for behavior docs
  don't cover: `get_repo_structure` + `search_doc` beats guessing internals.
- **brave-search** / **web-search-prime** — for anything with a "what's current" dimension
  (pricing, licensing, vulnerability news). Cite the URL in the answer or the ADR.
- **web-reader** — fetch a specific page's full content when search snippets aren't enough
  (docs pages, changelogs).
- **sequential-thinking** — for multi-step design decisions (schema changes, architecture):
  record the reasoning, it becomes the raw material for the ADR.
- **headroom** — compress large tool outputs (docs dumps, long logs) before reasoning over them.
- **node_repl** (with browser-use skill) — verify `npm run dev` pages in a real browser
  (console errors, filter interaction, lightbox) when a change is behavior-adjacent.
- **pencil** — when the user asks for new page/layout designs before coding them.

Rule of thumb: unfamiliar API → context7; non-trivial refactor → serena; UI change → visual
verification; decision worth remembering → sequential-thinking + ADR. Skip MCP when a direct
file read answers the question — don't burn calls for ceremony.

## Code style

- Tailwind 4: design tokens in `src/styles/global.css` `@theme`; reusable apply-able
  classes via `@utility`, not plain classes (v4 rejects `@apply` of unknown classes).
- TypeScript strict. Content schemas in `src/content.config.ts` (zod). `seoTitle`/
  `seoDescription` are intentionally blank-tolerant (`z.preprocess`) — don't tighten.
- Match existing comment density; no narration comments.
- Components: `.astro` first; React only where Keystatic demands it.

## Git

- Conventional commits (`feat:`, `fix:`, `docs:`, …), subject ≤ 50 chars.
- Demo deploys: **push to `main` is enough** — `.github/workflows/deploy.yml` runs
  check + build + deploy to the `gh-pages` branch automatically. Manual fallback:
  build with `DEPLOY_TARGET=gh-pages`, push `dist/` to `gh-pages` with `.nojekyll`.
- Contact-form key lives in `.env` (`PUBLIC_FORM_ACCESS_KEY`, gitignored) + the repo
  Actions secret; `.env.example` documents it. Never commit real keys.
- Hidden dirs (`.agent/`, `.serena/`, `.zcode/`, …) are gitignored local-only — never
  commit or force-add them. `.github/` is the one tracked hidden dir (CI).

## Do NOT

- Don't edit `dist/` (generated) or `node_modules/`.
- Don't enable Keystatic in production builds or expose `/keystatic` publicly.
- Don't put real client credentials/secrets in the repo or in memory files.
- Don't restructure `src/content/` frontmatter without updating both schemas (invariant above).
- Don't save test entries via the Keystatic UI against seeded content — it normalizes
  hand-written frontmatter (see `.agent/memory/lessons.md`).
