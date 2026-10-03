// @ts-check
import { defineConfig } from 'astro/config';
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
