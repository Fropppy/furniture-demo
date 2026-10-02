---
type: project
updated: 2026-10-02
---

# 0002 — Pin vite 6.4.3 + @vitejs/plugin-react 5.1.4 via overrides

## Context

Keystatic requires React (`@astrojs/react` + `@vitejs/plugin-react`). Astro 5.18.2 pins
vite 6.4.3, but `@vitejs/plugin-react@6.x` declares `vite: '^8.0.0'` and npm hoisted
vite 8.3.2 → two vites in the tree → `Missing field 'moduleType'` crash from
`builtin:vite-react-refresh-wrapper` on any `astro dev`/`build`. (Ref: astro issue #16229.)

## Decision

package.json:

```json
"overrides": {
  "vite": "6.4.3",
  "@vitejs/plugin-react": "5.1.4"
}
```

(5.1.4 peers `vite: ^4–^7`, so the single hoisted vite 6.4.3 satisfies everything.)

## Consequences

- The overrides block is load-bearing — removing it re-breaks dev (gotchas #1).
- Upgrading Astro means re-deriving the pair: check Astro's vite pin and
  `@vitejs/plugin-react` peer range together, then update both override lines.
- `vite.ssr.noExternal` + `optimizeDeps.exclude` for `@keystatic/astro` in astro.config.mjs
  are part of the same fix (esbuild optimizer can't resolve `astro:env/server`).
