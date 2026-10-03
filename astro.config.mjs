// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// TODO: set to the production domain before launch (drives canonical URLs + sitemap)
const SITE_URL = 'https://example.com';

// GitHub Pages project sites serve under /<repo>/ — build with DEPLOY_TARGET=gh-pages
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';

// Keystatic's admin routes are server-rendered: they run in `astro dev` out of
// the box, but a static deploy must exclude them (or ship an SSR adapter and
// build with ENABLE_KEYSTATIC=1 — see README).
const isDev = process.argv[2] === 'dev';
const useKeystatic = isDev || process.env.ENABLE_KEYSTATIC === '1';

export default defineConfig({
  site: isGhPages ? 'https://fropppy.github.io' : SITE_URL,
  base: isGhPages ? '/furniture-demo' : '/',
  // Default every <Image> to a responsive constrained layout (auto srcset +
  // sizes + webp). responsiveStyles injects the small global CSS that makes
  // those images scale/cover correctly.
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  // Hash-based meta CSP — works on GitHub Pages because Astro delivers it as
  // a <meta> tag (header mode would need an adapter). script-src stays strict
  // (hashes + self); style-src keeps 'unsafe-inline' because the reveal
  // animation uses style="--reveal-delay:…" attributes, which hashes can't
  // cover. Script injection is the XSS risk; style leakage is not.
  security: {
    csp: {
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
    },
  },
  // Hover prefetch of internal links — page-to-page nav on the portfolio is
  // near-instant for the price of a tiny script.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Self-hosted fonts via the Fontsource provider: emits @font-face + a
  // metric-matched fallback family (no swap CLS) and powers <Font preload />
  // in Base.astro. Vietnamese subset is required — the site is bilingual.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-astro-sans',
      // Range syntax = take the variable package (@fontsource-variable/inter)
      weights: ['100 900'],
      styles: ['normal'],
      subsets: ['latin', 'vietnamese'],
      fallbacks: ['ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Playfair Display',
      cssVariable: '--font-astro-display',
      weights: ['400 900'],
      styles: ['normal'],
      subsets: ['latin', 'vietnamese'],
      fallbacks: ['Georgia', 'serif'],
    },
  ],
  // EN unprefixed (default), VI under /vi/… — routing is manual: shared page
  // components render from src/pages/ and src/pages/vi/ with a locale prop.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vi'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({ filter: (page) => !page.endsWith('/rss.xml') }),
    react(),
    ...(useKeystatic ? [keystatic()] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
    // Route Keystatic through Vite's transform pipeline (not the esbuild dep
    // optimizer) so Astro's virtual `astro:env/server` module resolves in dev.
    ssr: { noExternal: ['@keystatic/astro'] },
    optimizeDeps: { exclude: ['@keystatic/astro'] },
  },
});
