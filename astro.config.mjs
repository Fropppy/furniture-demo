// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: set to the production domain before launch (drives canonical URLs + sitemap)
const SITE_URL = 'https://example.com';

// GitHub Pages project sites serve under /<repo>/ — build with DEPLOY_TARGET=gh-pages
const isGhPages = process.env.DEPLOY_TARGET === 'gh-pages';

export default defineConfig({
  site: isGhPages ? 'https://fropppy.github.io' : SITE_URL,
  base: isGhPages ? '/furniture-demo' : '/',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
