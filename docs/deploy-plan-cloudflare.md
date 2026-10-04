# Deploy plan — Cloudflare Pages (production launch)

Status: **plan, not yet executed** (2026-10-03). Target: move the FORMA Studio site from the
GitHub Pages demo (https://fropppy.github.io/furniture-demo/) to a custom domain on
Cloudflare Pages for the client launch. Section 5 covers the optional phase-2 move to
Keystatic Cloud for client self-editing.

Grounding: repo files read this session (`astro.config.mjs`, `package.json`,
`.github/workflows/deploy.yml`, `src/lib/site.ts`, `keystatic.config.ts`,
`public/robots.txt`, `README.md`, AGENTS.md invariants, `.agent/memory/state.md`) plus a
fresh `npm run build` (33 pages, exit 0) and the 2026-10 research digest + validated
performance verdicts (Cloudflare Pages/Workers docs, Keystatic Cloud docs, PoP coverage).
Where this plan deviates from the research digest it says so and why — the two deviations
are the CSP-in-`_headers` step (§3.3) and the default deploy mode (§3.1), both following the
validated verdicts over the digest's first pass.

Revision (2026-10-04, after external review — all corrections folded in): the §3.2 CI
snippet now uses the `secrets.` context (the original bare `${{ CLOUDFLARE_API_TOKEN }}`
expressions were actionlint-invalid and would have broken the **entire** workflow file, gh-pages
job included — the fixed workflow re-validated with actionlint 1.7.7 this session); the §4.3
`lang` expectation corrected to `vi` (the build emits `lang="en"` / `lang="vi"`,
`src/lib/i18n.ts:10`); the deploy-cloudflare job gained a launch guard (§3.2) so an early
merge cannot publish placeholder-URL canonicals to production; §1.4 re-scoped to the
git-integration path only; §5 now schedules the AGENTS.md / README.md rule updates phase 2
requires. External Cloudflare/Keystatic facts remain research-digest/verdict-sourced and were
not re-verified at review time; everything repo-checkable was.

Second cold-read pass (2026-10-04), also folded in: §2 gained the mandatory DNS pre-flight
(enumerate + recreate existing records **before** flipping nameservers) and a canonical-host
decision for www vs apex; §4.4 is now explicitly gated on the Web3Forms key + a post-key
deploy; §3.4 no longer implies automated branch previews; §6.2 adds search indexing (GSC +
sitemap submit); §3.2 documents how to reproduce the actionlint check and the wrangler-pin
commit ordering; hash/PDPD/check-duplication nits fixed.

Repo facts verified this session (so the plan doesn't assume them):

- `npm run build` → 33 pages, `dist/` = 52 files / 2.0 MB, largest file 216 KB — orders of
  magnitude under Cloudflare's free caps (20,000 files, 25 MiB/file, 500 builds/mo).
- `dist/404.html` exists (from `src/pages/404.astro`) — required, or Pages falls back to
  SPA routing (all paths → `/`).
- `dist/_astro/` holds every content-hashed asset (CSS, JS, PhotoSwipe chunks, `fonts/`)
  — one `_headers` rule covers them all. `public/` has no `_headers`/`_redirects` yet.
- The hash-based meta CSP ships in the built HTML with per-build `sha256-…` script hashes
  and `connect-src https://api.web3forms.com` (seen in `dist/index.html`).
- `dist/vi/` routes build (about, contact, journal, projects, index) — bilingual verification
  in §4 is against real output.
- **No `.nvmrc` / `.node-version` exists** (checked) — Cloudflare's v3 build image does not
  read `package.json` `engines`; local Node is v22.21.1, CI uses Node 22.
- `astro.config.mjs:9` — `SITE_URL = 'https://example.com'` (TODO marker); `public/robots.txt`
  sitemap line still points at `fropppy.github.io/furniture-demo` (verified in `dist/robots.txt`).
- Web3Forms endpoint + access-key env: `src/lib/site.ts:55-60`; key is public-safe by design.

---

## 0. Prerequisites and open decisions

### 0.1 Prerequisites (things that gate the launch)

| # | Item | Owner | Gate |
| - | ---- | ----- | ---- |
| 1 | Production domain purchased (or available to move to Cloudflare DNS) | client | Blocks §2 entirely. All of §1's config edits can be prepared before it, but not committed as final. |
| 2 | Final brand facts: studio name, phone, email, address, socials | client | Blocks §1.2 (placeholder "FORMA Studio" facts live in `src/lib/site.ts:4-18` and `scripts/make-og.mjs:8` `BRAND` block by design). |
| 3 | Web3Forms access key created with the admin inbox email | client/dev (human with the mailbox) | Blocks form delivery post-launch (§6.1). Until set, the form shows its graceful not-configured fallback — no crash. |
| 4 | Cloudflare account (free plan is sufficient — see limits below) | dev | Blocks §3. |
| 5 | Real project photography + PDPD releases (Vietnam's Personal Data Protection Decree 13/2023 — model/location consent for published photos) | client | Does **not** block launch — SVG illustrations are the designed fallback (ADR 0005). Note: image performance is untested until the first real photos land (validated verdict — `src/assets/` doesn't exist yet, checked). |

Free-tier headroom (checked against the 2026-09 limits page via the research digest):
500 builds/month, 1 concurrent build, 20-min build timeout, 20,000 files/site, 25 MiB/file,
100 custom domains, unlimited preview deployments. This repo's build (52 files / 2.0 MB /
~3 s) uses a rounding error of all of these. Commercial use on Pages free is the normal
website pattern here (static HTML + self-hosted images in own pages); do a one-time read of
the live Cloudflare Self-Serve Subscription Agreement §2.8 before contracting (the research
could not verify the primary text — flagged, not assumed).

### 0.2 Open decisions (decide before §3)

| Decision | Options | Recommendation |
| -------- | ------- | -------------- |
| **Deploy mode** — irreversible per project: a Git-integration Pages project can never switch to Direct Upload (and vice versa) without creating a new project | (a) Cloudflare Git integration — zero CI config, per-PR preview URLs. (b) Direct Upload via the existing GitHub Actions workflow (`wrangler pages deploy dist`) | **(b) Direct Upload from Actions.** Reasons: the repo already builds in Actions with the Astro image cache step (`.github/workflows/deploy.yml:32-38`) which Cloudflare's build image cannot reuse — every content commit would re-encode all photos there; the Keystatic phase (§5) uses `wrangler` against Workers anyway; and it avoids locking out the Actions path. This also matches the validated verdict's escape hatch ("move deploys to wrangler-from-Actions — mode chosen at project creation"). The digest's Route A default (git integration) is the legitimate lower-effort alternative if per-PR preview URLs matter more; at today's scale re-encoding is trivial, photos are coming (ADR 0008). Decision table: §3.1. |
| **Keystatic Cloud now or later?** | Launch pure static (dev-only admin) vs. launch already on Workers + cloud editing | **Later — launch static on Pages, do §5 as a separate phase** once the client confirms they want hosted self-editing. Once production mounts Keystatic with an SSR adapter, GitHub Pages can never serve the site again — the static fallback and the hosted admin are mutually exclusive production states (validated verdict). Sequencing keeps the launch low-risk and the gh-pages demo alive as an emergency path. |
| **Analytics / chat widgets** (GA4, Meta Pixel, Zalo) | add at launch vs. later | Client decision (backlog item 5 in `.agent/memory/state.md`). If added, they change the CSP story — any third-party script needs hashes/directives in `astro.config.mjs:35-40`. Decide before launch, not after. |
| **gh-pages demo retirement** | keep deploying both vs. retire | Keep both during transition (this plan's §3.4 deploys to both from one push); retire gh-pages at handoff or when §5 ships, whichever comes first. |

---

## 1. Content/config prep (repo changes)

All edits are small and reversible; do them in one commit (`chore: launch prep for cloudflare`).

### 1.1 Set the production URL

`astro.config.mjs:8-9` — replace the TODO:

```js
// TODO: set to the production domain before launch (drives canonical URLs + sitemap)
const SITE_URL = 'https://<your-domain>';
```

This one constant drives canonical URLs, OG URLs, JSON-LD, the sitemap and RSS. `base` stays
`/` (the `isGhPages` branch at `astro.config.mjs:12,21-22` keeps the demo path working
untouched). **No link changes anywhere**: every internal link/asset/canonical/OG/JSON-LD URL
already goes through `withBase()` (`src/lib/site.ts:24-26`) — the AGENTS.md hard invariant —
so a root-domain build needs zero link edits. Verify: the build in §1.5 must show URLs on
`<your-domain>` in `dist/index.html` canonical/OG tags.

### 1.2 Brand + contacts (when the client supplies final facts)

- `src/lib/site.ts:4-18` — `SITE` name, tagline, description, phone, email, address, socials.
- `scripts/make-og.mjs:8` `BRAND` block — it deliberately mirrors `site.ts` (cannot import
  TS), so both files change together.

### 1.3 robots.txt

`public/robots.txt` is a static file — the sitemap line does **not** follow `SITE_URL`
(currently hardcodes the demo URL; verified in `dist/robots.txt`). Replace line 4:

```
Sitemap: https://<your-domain>/sitemap-index.xml
```

Note: the file ships verbatim to **both** deploy targets (it is a plain `public/` file, not
generated per `DEPLOY_TARGET`), so until the gh-pages demo retires (§0.2), the demo at
`fropppy.github.io/furniture-demo` will advertise the production sitemap URL. Cosmetic for a
transitional demo — accept it; split the file per target only if the demo outlives the
transition.

### 1.4 Node pinning (needed only for the §3.1 git-integration alternative)

Commit a root `.nvmrc` containing `22` (matches CI's `node-version: 22` in
`deploy.yml:24`; local is v22.21.1). This is **not** a dependency of the recommended
Direct-Upload path — GitHub Actions pins Node itself (`deploy.yml:24`). It only matters if
the §3.1 alternative is chosen (Cloudflare's build image building the repo): that image
defaults to Node 22.16.0, ignores `package.json` `engines` (which this repo doesn't set), and
receives rolling updates, so unpinned builds can break unannounced. Cheap to commit anyway
(documents the toolchain); required only for git-integration.

### 1.5 Regenerate OG image + build gate

```bash
npm run og        # regenerates public/og-default.png from the BRAND block
npm run build     # astro check + build — must pass before any deploy
```

Verify: `dist/robots.txt` shows the new sitemap URL; `grep -o '<link rel="canonical"[^>]*>'
dist/index.html` shows `https://<your-domain>/`; `ls dist/_headers` fails until §3.3 (expected).

### 1.6 Optional pre-launch cleanup (perf, not a launch blocker)

`dist/_astro/client.CCxN9xF8.js` (216 KB, verified this session) is a React client runtime
emitted by the unconditional `react()` integration (`astro.config.mjs:77`) and referenced by
no page — it ships in every deploy for nothing. The homepage also eagerly ships an 87.9 KB
Swiper chunk. Neither blocks a green Lighthouse band (both are deferred modules), but gating
`react()` (Keystatic needs it only when mounted) and lazy-loading Swiper like PhotoSwipe
already is are cheap wins. Do them only if time allows; re-run `npm run build` + the §4
behavior checks after.

---

## 2. Domain + DNS

1. **Pre-flight — enumerate existing DNS records BEFORE touching nameservers.** §0.1 item 1
   allows a domain that may already be live elsewhere: if it handles email or anything else
   (MX; SPF/DKIM/DMARC TXT; A/CNAME for other hosts; mail-provider, Zalo, or Google
   verification records), pointing the registrar's nameservers at Cloudflare without first
   recreating those records in the new zone silently kills client email and whatever else
   hangs off the domain — the classic paying-client launch disaster. Export the current
   zone from the registrar panel (or `dig MX <your-domain>`, `dig TXT <your-domain>`,
   `dig CNAME` for every known subdomain), recreate **every** record in the Cloudflare zone,
   and diff against the export before the NS switch.
2. **Zone on Cloudflare (recommended):** add `<your-domain>` in the Cloudflare dashboard and
   point the registrar's nameservers at Cloudflare (only after step 1). Needed for an
   apex/naked domain — Cloudflare creates the apex CNAME for you. Bonus: the zone is what
   puts Vietnamese visitors on in-country edge locations (Hanoi/SGN/DaNang PoPs; the
   current gh-pages demo serves from Singapore — observed `x-served-by: cache-sin…` in the
   research).
3. **Subdomain alternative:** if only `www.<your-domain>` is used and DNS stays external,
   a CNAME `www → <project>.pages.dev` suffices — but the domain must still be registered in
   the Pages dashboard (step 5); a bare manual CNAME without that yields **522 errors**.
4. **Decide the canonical host — apex or www — and handle BOTH hostnames.** This decides
   what §1.1's canonical/OG/sitemap URLs emit, so make it before finalizing §1. Attach the
   chosen host in step 5; for the other hostname, either attach it too as a second custom
   domain (the 100-domain free cap allows it) and add a zone Redirect Rule (Rules →
   Redirect Rules, 301 non-canonical → canonical), or deliberately leave it unattached and
   accept `www.<domain>` NXDOMAIN — in writing, with the client. Mid-deploy is the wrong
   time to decide this.
5. **Custom domain attach (after §3 creates the project):** Workers & Pages → project →
   *Custom domains* → *Set up a domain*. Free plan allows 100 per project.
6. **CAA check:** if the zone has CAA records, they must allow Cloudflare's CAs
   (`letsencrypt.org`, `pki.goog` with `cansignhttpexchanges=yes`, `ssl.com`) or certificate
   issuance silently fails.
7. Verify: `dig +short <your-domain>` resolves (and the non-canonical host, per step 4);
   `curl -sI https://<your-domain>` returns the Pages response with a `cf-ray` header once
   issued (SSL can take a few minutes).

**Gate:** nothing in §3.4's first deploy needs the domain — `*.pages.dev` works immediately;
the domain can attach any time after.

---

## 3. Cloudflare Pages project setup

### 3.1 Create the project (mode decision is made here and is irreversible)

Dashboard → Workers & Pages → Create → Pages → **Direct Upload** (per §0.2) — but don't
drag-and-drop; create it via CLI so CI owns it. First pin wrangler — it is **not** a
dependency of this repo (absent from `package.json` dependencies and devDependencies), and a
bare `npx wrangler` fetches unpinned latest at runtime (non-reproducible, at odds with the
repo's pinning posture in `deploy.yml:17-19`, and triggers a one-time interactive
"Ok to proceed?" prompt):

```bash
npm i -D -E wrangler@4.147.0   # latest at time of writing (2026-10-04); re-check
                               # `npm view wrangler version` when executing. -E = exact
                               # pin, no caret drift in package.json.
npx wrangler login             # resolves the pinned local binary from here on
npx wrangler pages project create furniture-prod --production-branch=main
# if the flag spelling differs, run: npx wrangler pages project create --help
# (the research could not verify the exact flag; the interactive prompt also asks it)
```

Project name becomes `furniture-prod.pages.dev`. Research-digest note (sourced to Cloudflare's
Pages limits page): there is a throttle on new projects during an account's first 48 hours —
if it bites on launch day, create the project a day early; nothing in §3.4's first deploy
needs the domain (see the gate at the end of §2), so early creation is safe. Also commit the
`package.json` / `package-lock.json` pin change here — §3.2's ordering guard depends on it.

*If Git integration was chosen instead (§0.2 alternative):* Import the GitHub repo,
production branch `main`, build command `npm run build` (includes `astro check` — the type
gate survives), output dir `dist`, and set `NODE_VERSION=22` + `PUBLIC_FORM_ACCESS_KEY` as
build environment variables in the dashboard.

### 3.2 CI: add a Cloudflare deploy job to the existing workflow

Extend `.github/workflows/deploy.yml` with a second job (keep the gh-pages job during
transition — one push deploys both). Two things are load-bearing in this snippet:

- **`secrets.` context is mandatory.** Bare `${{ CLOUDFLARE_API_TOKEN }}` is an undefined
  variable — GitHub validates expressions when parsing the workflow file, so an invalid
  expression breaks the **entire** deploy.yml (the gh-pages job too), not just this job.
  Keep the file actionlint-clean: actionlint is **not** installed in this repo and no CI
  step runs it (nothing to re-run as-is), so make the check reproducible — install via the
  official script (`bash <(curl https://raw.githubusercontent.com/rhysd/actionlint/main/scripts/download-actionlint.bash)`,
  URL verified reachable 2026-10-04) and re-run after every workflow edit; GitHub also
  re-validates expressions when the file is pushed. Attribution: the pass claim below was
  produced in the planning session (actionlint 1.7.7, this exact YAML block wrapped in a
  minimal workflow header → exit 0); an independent reviewer could only syntax-check
  (PyYAML parse + expression-context audit) — treat this recipe, not the recorded claim,
  as the guarantee. Optional: enforce it in CI (reviewdog/actionlint, or the script above
  in a pre-deploy step) instead of relying on memory.
- The standalone `npm run check` step is technically redundant — `npm run build` already
  runs `astro check` (`package.json:9`) — but is kept for parity with the existing gh-pages
  job (`deploy.yml:41-42`); drop one if build minutes ever matter.
- **The `if:` guard is the launch gate.** The workflow fires on every push to `main`
  (`deploy.yml:4-5`), so an unguarded job starts deploying to production Pages on the first
  push after it merges — while §1.1/§1.3 may still be blocked on client facts and the build
  still emits `og:url https://example.com/` (verified in `dist/index.html`), putting
  placeholder canonical/OG/sitemap URLs on an indexable `furniture-prod.pages.dev`
  (production pages.dev is indexable; only previews get `X-Robots-Tag: noindex`). Keep
  `CLOUDFLARE_DEPLOY_ENABLED` unset until launch-ready, then flip it — ideally in the same
  push as the §1.1/§1.3 commits. (Alternative with the same effect: fold this job into the
  same commit as the §1 config changes and skip the variable.)

```yaml
  deploy-cloudflare:
    if: vars.CLOUDFLARE_DEPLOY_ENABLED == '1'   # launch guard — see above; flip at §1 completion
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0 (keep SHA-pinning)
      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - name: Restore Astro image cache
        uses: actions/cache@0057852bfaa89a56745cba8c7296529d2fc39830 # v4.3.0
        with:
          path: node_modules/.astro
          key: astro-images-${{ runner.os }}-${{ hashFiles('src/assets/**', 'package-lock.json') }}
          restore-keys: |
            astro-images-${{ runner.os }}-
      - run: npm run check
      - run: npm run build        # custom-domain mode: no DEPLOY_TARGET
        env:
          PUBLIC_FORM_ACCESS_KEY: ${{ secrets.PUBLIC_FORM_ACCESS_KEY }}
      - run: npx wrangler pages deploy dist --project-name=furniture-prod --branch=main
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

Repo configuration to add under Settings → Secrets and variables → Actions:
`PUBLIC_FORM_ACCESS_KEY` (secret; already exists for the gh-pages job, `deploy.yml:45`), a
Cloudflare API token (secret `CLOUDFLARE_API_TOKEN`, *Cloudflare Pages: Edit* permission),
the account ID (secret `CLOUDFLARE_ACCOUNT_ID`), and the **variable**
`CLOUDFLARE_DEPLOY_ENABLED=1` (Variables tab) when launch-ready. The access key is baked
into the client bundle at build time (`src/lib/site.ts:57` uses `import.meta.env`) — it must
be set at **build** time, and it is public-safe by design.

**Ordering guard (launch day):** the §3.1 wrangler pin (`package.json` +
`package-lock.json`) must be committed to `main` BEFORE — or atomically with — flipping
`CLOUDFLARE_DEPLOY_ENABLED=1`. Otherwise the first CI run resolves `npx wrangler` as
unpinned latest at runtime, re-creating exactly the drift §3.1 pins against. The pin commit
and the variable flip are two halves of one step.

### 3.3 `public/_headers` — security + caching headers

Create `public/_headers` (no extension; Astro copies it into `dist/`; Pages parses it, never
serves it; ≤100 rules, ≤2,000 chars/line):

```
/*
  Strict-Transport-Security: max-age=300
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Content-Security-Policy: frame-ancestors 'none'

/_astro/*
  Cache-Control: public, max-age=31556952, immutable
```

**Deliberate deviation from the research digest** (which said: serve the full CSP via
`_headers` and drop the meta tag once live) — following the validated verdict instead:

- The digest's move would **break this site**. Astro stamps per-build `sha256-…` hashes into
  the meta CSP (`astro.config.mjs:35-40`; verified in `dist/index.html`), pages contain
  inline module scripts (scroll-reveal from `src/layouts/Base.astro`), and `.reveal` content
  starts at `opacity: 0` with no noscript fallback. A static `_headers` file can't carry
  hashes that change every build; multiple CSPs enforce cumulatively, so a hashless header
  policy would block the reveal script and permanently hide reveal content (or force
  `unsafe-inline`, gutting script-src).
- Therefore: the **meta CSP stays the script/style policy** (it self-updates per build and
  keeps the gh-pages fallback protected too), and the `_headers` CSP carries **only
  `frame-ancestors 'none'`** — a directive the meta tag cannot express (the HTML spec strips
  it from meta-delivered policies) and which coexists cumulatively without constraining
  scripts. Consolidate into a header only if inline scripts are ever eliminated.
- HSTS starts at `max-age=300` on purpose; raise it to `max-age=31536000; includeSubDomains`
  after a verified week (HSTS is sticky — don't brick a fresh domain on day one). Pages
  already sends `nosniff` and `strict-origin-when-cross-origin` by default; restating them
  makes the policy explicit and survives default changes.
- The `/_astro/*` immutable rule covers every hashed asset including fonts (verified:
  `dist/_astro/fonts/`). Do **not** extend it to unhashed root files (`og-default.png`,
  `rss.xml`, `robots.txt`) — leave those on Pages' default `max-age=0, must-revalidate`.
- HTML stays at the Pages default (revalidate + ETag). Never add a long-TTL HTML rule.
- Note for later: `_headers` applies to **static asset responses only** — Worker/SSR
  responses (the §5 admin routes) don't get these headers.

No `_redirects` file: the site has no legacy URLs. If the client's previous site had URLs to
preserve, add `source destination [code]` lines then (≤2,000 static + 100 dynamic).

### 3.4 First deploy

```bash
npm run build && npx wrangler pages deploy dist --project-name=furniture-prod --branch=main
```

Push to `main` thereafter (Actions handles it). If the Web3Forms key is not yet in `.env`,
this deploy legitimately ships the form's not-configured fallback — expected, not a bug;
§4.4 gates the form test on the key + a post-key deploy.

Note there are **no automated per-branch or PR previews** in this mode — the workflow
triggers only on push to `main` and `workflow_dispatch` (`deploy.yml:3-6`; the trade-off was
accepted in §0.2). To preview a branch, deploy it manually: `npx wrangler pages deploy dist
--branch=<branch>` → alias at `<branch>.furniture-prod.pages.dev`. Previews are unlimited,
permanent per-hash, and send `X-Robots-Tag: noindex`.

Verify the deploy exists: dashboard → project → Deployments shows the production deployment.

---

## 4. Deploy + verification

Run the whole checklist against `https://<your-domain>` (and spot-check the pages.dev URL).
Nothing below was run against Cloudflare yet — it is the post-deploy gate.

### 4.1 Headers

```bash
curl -sI https://<your-domain>/
CSS=$(ls dist/_astro/Base.*.css); curl -sI "https://<your-domain>/_astro/${CSS#dist/_astro/}"
# hashed names change every build (Base.SlvUzkvd.css today; Base.D1Q2c5Gb.css the week
# before) — take the live name from dist/_astro, never copy-paste a stale hash
```

Expect: `strict-transport-security`, `x-frame-options: DENY`,
`content-security-policy: frame-ancestors 'none'`, `etag`, HTML at
`cache-control: public, max-age=0, must-revalidate`, the CSS/JS at
`max-age=31556952, immutable`, `content-encoding` (Pages: gzip/brotli), and `alt-svc` with
h3 if HTTP/3 is on (Speed → Settings → Protocol Optimization; confirm in dashboard, don't
assume). Then `curl -s https://<your-domain>/ | grep -c sha256-` — the meta CSP with fresh
hashes must be present in the served HTML.

### 4.2 Cloudflare content-injection features (zone settings — keep OFF)

- **Rocket Loader OFF** (Speed → Optimization → Content): its injected inline bootstrap
  cannot match any of the meta CSP's per-build hashes — it gets blocked or pressures
  `unsafe-inline`; documented to break module sites. Do not enable even experimentally
  without re-running §4.5.
- **Email Address Obfuscation OFF** (Scrape Shield): it rewrites the live mailto links
  (`src/components/Footer.astro`, `src/components/pages/ContactPage.astro`) into content
  that only appears after its decode script runs — JS-gated contact info on a
  contact-driven portfolio — and forces response decompress/re-compress. (It would *not* be
  CSP-blocked — its `/cdn-cgi/` script is same-origin and `script-src` includes `'self'`;
  the keep-OFF reason is content rewriting, per the validated verdict.)
- **Auto Minify: does not exist** (removed 2024-08-05). Minification is the Astro build's
  job; don't hunt for the toggle.
- Verify none are active: `curl -s https://<your-domain>/ | grep -E 'rocket-loader|email-decode'`
  must return nothing.

### 4.3 Routes

- `curl -sI https://<your-domain>/vi/` → 200; open in browser: VI toggle links to the EN
  equivalent, hreflang alternates present, and `<html lang="vi">` — exactly `vi`, **not**
  `vi-VN`: `src/lib/i18n.ts:10` maps `HTML_LANG = { en: 'en', vi: 'vi' }` (short-form BCP-47
  by design; verified in `dist/vi/index.html`, EN pages emit `lang="en"`). README.md:102 says
  `en-US`/`vi-VN` — the README overstates this; don't "fix" the site to match it.
- `curl -sI https://<your-domain>/projects/<some-slug>/` → 200 (a real slug from
  `src/content/projects/`).
- `curl -sI https://<your-domain>/no-such-page` → serves the styled 404 (`dist/404.html`
  exists, verified) — **not** the homepage (that would mean SPA fallback).
- Sitemap: `https://<your-domain>/sitemap-index.xml` lists both locales; matches the new
  robots.txt line.

### 4.4 Form — gated on §0.1 item 3 AND a post-key deploy

This check **cannot pass yet**: the Web3Forms access key does not exist (§0.1 item 3,
`.agent/memory/state.md` "needs user"), and the key is baked in at build time
(`src/lib/site.ts:57`, `import.meta.env`) — so the §3.4 manual deploy serves the form's
graceful not-configured fallback (phone/email). That fallback is correct behavior, not a
broken form. Order of operations:

1. Create the access key (§0.1 item 3) → `.env` + the `PUBLIC_FORM_ACCESS_KEY` repo secret.
2. Land a deploy built **with** the key present (push to `main` and let Actions build it,
   or rebuild locally with `.env` set and redeploy).
3. Then: submit a test enquiry on `/contact` → arrives in the admin inbox; success
   `role="status"` message shows.
4. Submit from a non-production domain too if possible — until §6.1's domain-lock, the key
   works from anywhere.

### 4.5 Behavior + performance

- Browser console on `/`, `/projects/…`, `/vi/`: **zero CSP violations** (a violation here
  is the first symptom of any Cloudflare injection that slipped through §4.2).
- PhotoSwipe opens on project galleries (lazy-loaded chunks); hover-prefetch fires on link
  hover (Network tab); mobile menu works.
- PageSpeed Insights (mobile, production URL): read the CrUX field section first (28-day
  real users; a fresh domain may have no CrUX data yet — that's expected, not a failure).
  Lighthouse lab: the realistic band is **90–100 green** — but not because the site is
  "zero-JS": the homepage ships an 87.9 KB Swiper chunk + 2.4 KB prefetch runtime
  (validated verdict; verified in `dist/_astro/` this session). A 100 is explicitly not
  expected per Google. Optional: add Lighthouse CI to the workflow later
  (`@lhci/cli`, `categories:performance >= 0.9`).
- Vietnam delivery: `curl -w '%{time_starttransfer}\n' -so /dev/null https://<your-domain>/`
  before (gh-pages) and after; check `cf-ray` colo suffix ends `HAN`/`SGN`/`DAD` before
  telling the client the site is served in-country. Treat the edge win as directional until
  measured — the research found no authoritative latency benchmark.

---

## 5. Keystatic Cloud admin (phase 2 — gated on the client wanting self-editing)

Today's admin is **dev-only**: `storage: { kind: 'local' }` (`keystatic.config.ts:229`) and
the integration gated to `astro dev` / `ENABLE_KEYSTATIC=1` (`astro.config.mjs:17-18`) —
per the AGENTS.md invariant, Keystatic routes are `prerender: false` and **break static
builds**, which is why production has no admin at all. This section is what changes if the
client gets a hosted admin.

### 5.1 Decision table — dev-only admin vs. Keystatic Cloud

| | Dev-only (status quo) | Keystatic Cloud (`storage.kind: 'cloud'`) |
| - | ---------------------- | ------------------------------------------ |
| Who can edit | Developer, on their machine (`npm run dev` → `/keystatic`) | Invited team members via email login at the deployed `/keystatic` — **no GitHub account needed** |
| Where edits land | Working tree → manual commit/push | Direct GitHub commits to `Fropppy/furniture-demo` via Keystatic Cloud's GitHub proxy; live after CI rebuild (**save → live lag = one build**, known client-expectation issue) |
| Host requirement | Any static host (gh-pages OK) | SSR host for `/keystatic` + `/api/keystatic/*` — **Cloudflare Workers, not Pages** (the `@astrojs/cloudflare` adapter dropped Pages support) |
| Auth dependency | None | Keystatic Cloud account/service (new external dependency; it owns GitHub auth) |
| Cost | $0 | Free ≤ 3 users/team (owner + client fits); Pro $10/mo/team adds more users + Cloud Images |
| Image uploads | Into git via Keystatic → `src/assets/...` (current pipeline, ADR 0008) | Same unless Pro Cloud Images adopted (would replace the astro:assets flow — untested interaction, don't adopt casually) |
| Audit trail / revert | git, same as now | git (each save is a commit — revert = `git revert`) |
| gh-pages fallback | Intact | **Gone** — a server-mounted admin can never run on GitHub Pages |
| Risk | Client can't edit without the dev | Workers free tier's **10 ms CPU cap** on the SSR/auth routes is untested for this stack (auth/session work typically uses 10–20 ms; overrun = Error 1102) → test in staging, budget Workers Paid $5/mo as contingency |

Recommendation: stay dev-only for launch; start §5 only when the client commits to
self-editing (the open offer recorded in `.agent/memory/state.md` says: plan before
promising). Free tier fits owner + client (2 users).

### 5.2 What changes vs. the pure-static setup (in order)

1. **Keystatic Cloud side:** create the account/team at keystatic.cloud, create a project,
   connect it to `Fropppy/furniture-demo`, note the `<team>/<project>` slug, invite the
   client (email).
2. **`keystatic.config.ts:228-233`** — the switch is already stubbed as a comment:
   `storage: { kind: 'cloud' }` + `cloud: { project: '<team>/<project>' }`. The
   dual-schema invariant (mirrors `src/content.config.ts`) is untouched by this.
   ⚠️ Unverified: whether `kind: 'cloud'` still allows local-disk editing in `astro dev`,
   or whether dev logins route through the cloud too. Test locally first; if dev breaks,
   the config is a TS file — a per-env switch (cloud in prod builds, local in dev) is the
   plausible fix but is untested. Record the outcome in memory.
3. **SSR adapter:** `npx astro add cloudflare`. Output stays static-by-default — every
   content page remains prerendered; only the injected `/keystatic` + `/api/keystatic/*`
   routes are server-rendered. This is the officially endorsed pattern (Keystatic's own
   env-gated recipe is the inverse of this repo's current gate).
4. **Gating change** (`astro.config.mjs:17-18`): production builds now run **with**
   `ENABLE_KEYSTATIC=1` so the admin mounts. Mechanically the integration stays flag-gated —
   never unconditional — but this **contradicts AGENTS.md as written** (hard invariant
   "Keystatic integration stays gated (dev / `ENABLE_KEYSTATIC=1`)"; Do-NOT bullet "Don't
   enable Keystatic in production builds or expose `/keystatic` publicly"; Commands line
   calling the flag build "non-prod only"). Don't argue the written rules away — rewrite
   them in the same change (step 10), or a future agent honoring AGENTS.md literally will
   revert this. Local dev is unchanged.
5. **Host = Workers, not Pages:** deploy with `wrangler deploy` (Workers static assets).
   Prerendered files are served as static assets **without invoking the Worker** (so they
   stay free/unmetered); unmatched routes — the admin UI — fall through to the Worker.
   `wrangler.jsonc`: `compatibility_date` ≥ `2026-08-04` (nodejs_compat on by default —
   Keystatic needs Node APIs on workerd), assets directory `dist`, and configure 404
   handling explicitly (the Pages `404.html` convention doesn't carry over automatically —
   check `not_found_handling` in the Workers assets docs during setup; **not verified in
   the research**). Test with `astro build && astro preview` under real workerd.
   Known-avoided trap: Keystatic's *self-hosted GitHub OAuth* is broken on Cloudflare —
   cloud mode bypasses OAuth entirely, which is exactly why this plan prescribes cloud mode
   and not `storage.kind: 'github'`.
6. **CI:** swap the Pages step for `npx wrangler deploy` (same `CLOUDFLARE_API_TOKEN`
   secret, token scope changes to Workers). Content commits from the client now trigger
   rebuilds like any other push. Keep `dist/.nojekyll` concerns gh-pages-only.
7. **Headers:** `/*` static rules don't apply to the Worker-served admin HTML — the admin
   needs its own security headers if wanted (Worker-level), and can never inherit the
   `/_astro/*` cache rule (good). The meta CSP keeps working unchanged — it is
   adapter-independent (verified: present in the built HTML regardless of host).
8. **Secrets:** via `npx wrangler secret put` / wrangler vars — never committed files.
9. **Version note:** compat is fine — installed `@keystatic/astro@6.0.0` peers with
   Astro `5 || 6 || 7`; this repo runs astro 7.3.5 (`package.json:23`). The older
   Astro-6 crash is resolved by v6.
10. **Sync the written rules in the same commit** (the repo must not contradict itself —
    see step 4): `AGENTS.md` — the hard-invariant bullet on Keystatic gating, the Do-NOT
    Keystatic bullet, the Commands line for `ENABLE_KEYSTATIC=1 npm run build`, and the
    Git/deploy section (production deploy target becomes Workers); `README.md:71-74` — the
    client-editing bullet recommends `@astrojs/vercel`, but this plan's adapter is
    `@astrojs/cloudflare` on Workers — fix it; `.agent/memory/` (`state.md` status line,
    `gotchas.md` entry for the flag-in-production posture); ADR 0011 (below).

### 5.3 Staging acceptance loop (run before client handoff)

On the Workers staging deploy: client logs in at the deployed `/keystatic` via Keystatic
Cloud → edits a project → save → **verify the commit lands in `Fropppy/furniture-demo`** →
CI rebuilds → the live site reflects the edit. Watch the admin routes for **Error 1102**
(the 10 ms CPU cap) during login/save — this is the one place the "$0" cost claim can
break; if it trips, Workers Paid is $5/mo. Time the save→live lag and set the client's
expectation explicitly ("your edit is live in ~N minutes").

New ADR required when this ships (ADR 0011: Workers + Keystatic Cloud; supersedes the
static-only posture of ADR 0003/0004 for production), with the step-10 doc syncs (AGENTS.md,
README.md, memory) landing in the same change.

---

## 6. Post-launch

### 6.1 Web3Forms

- If not yet created: access key at web3forms.com with the admin inbox → `.env` +
  `PUBLIC_FORM_ACCESS_KEY` Actions secret (§3.2). Until set, the form shows its built-in
  not-configured fallback (phone/email).
- Once the custom domain is live: **upgrade to Web3Forms Pro and domain-lock the key** to
  `<your-domain>` (backlog item 8, `.agent/memory/state.md`). Until locked, the key is
  usable by anyone who reads the page source — acceptable at launch, close it before
  handing off.
- If spam arrives: enable Web3Forms hCaptcha (the built-in honeypot + time-trap stays).

### 6.2 Search indexing

§1.1/§1.3 fix canonicals, robots.txt and the sitemap, but the domain is new to search
engines — make it findable: verify `<your-domain>` in Google Search Console (DNS TXT
verification — do it while the §2 zone is fresh in mind), then submit
`https://<your-domain>/sitemap-index.xml` (Search Console → Sitemaps). Add Bing Webmaster
Tools if the client cares (it can import the verified GSC site in one click). Spot-check
`site:<your-domain>` weekly for the first month; expect the demo domain
(`fropppy.github.io`) to keep ranking until the new domain accumulates signals.

### 6.3 Cache purge strategy

- **On Pages: do nothing.** Every deployment invalidates the edge cache automatically;
  HTML revalidates via ETag; assets are immutable-hashed. Cloudflare explicitly recommends
  against custom caching on Pages.
- **Standing invariant (worth an AGENTS.md line if it ever changes):** never add zone Cache
  Rules matching HTML or `/*` with TTL > 0 — the only documented stale-after-deploy vector.
  If staleness ever appears: zone → Caching → Configuration → **Purge Everything**.
- **If/when §5 moves the site to Workers:** the deploy-invalidation guarantee is documented
  for Pages only — the research found no caching-parity statement for Workers static
  assets. Verify empirically in staging (deploy → confirm HTML ETag changes and fresh HTML
  serves immediately) before relying on it.

### 6.4 Client handoff

- Editor guide exists: `docs/huong-dan-nhap-lieu.md` (Vietnamese, covers uploads + alt
  rules, ≤500 KB/2560 px guidance baked into field descriptions). Update it if §5 changes
  the login flow (cloud login vs. dev-only).
- Hand over: domain registrar credentials (or keep registrar + DNS on the dev's account —
  state which, in writing), Cloudflare account membership, Web3Forms inbox ownership,
  Keystatic Cloud team invite (if §5 shipped).
- Set expectations in writing: save→live lag (§5.3), photo guidelines (§0.1 item 5),
  what a content "publish" triggers (a git commit + rebuild — visible in the repo).
- Monitoring: PageSpeed Insights monthly; watch first real-photos deploy for build time
  (every content commit re-encodes changed photos; the 20-min build timeout is far away at
  3 s builds, but re-measure after photography lands).

### 6.5 Rollback

- **Site code/config:** dashboard → Deployments → ⋮ on any successful **production**
  deployment → *Rollback to this deployment* — instant, and roll-forward works afterwards.
  Preview deployments are not rollback targets. Emergency static fallback while it still
  exists: gh-pages (demo URL) is deployed independently by the other job.
- **Content (post-§5):** each editor save is a git commit — `git revert <sha>` and push;
  CI rebuilds. No separate CMS database exists to corrupt.
- **Config errors (bad `_headers`, wrong SITE_URL):** fix-forward via a new commit is
  usually faster than rollback; rollback is for broken builds/deploys.

### 6.6 Effort estimates (rough, one developer)

| Stage | Effort |
| ----- | ------ |
| §1 prep (domain fact-dependent edits + .nvmrc + og) | 1–2 h (blocked on client facts) |
| §2 domain + DNS | 0.5–1 h hands-on (+ record migration/verification if the domain is already live, §2.1) + propagation (minutes if NS move to Cloudflare goes smooth; up to 24–48 h worst case) |
| §3 project + CI job + `_headers` | 2–3 h incl. first-deploy debugging |
| §4 verification (full checklist) | 1–2 h |
| **Launch total (§1–§4)** | **≈ 1 working day + DNS waiting** |
| §6 post-launch (Web3Forms key + domain-lock, search-engine verify + sitemap submit) | 0.5–1 h |
| §5 Keystatic Cloud phase | 0.5–1 dev day + one staging round with the client; $0–5/mo ongoing |
| Ongoing | ≈ 0 — push-to-deploy; 500 free builds/mo vs. content-edit frequency that tops out far below it |
