import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { STYLE_TAGS } from './lib/site';

const scenes = z.enum([
  'living',
  'bedroom',
  'kitchen',
  'dining',
  'office',
  'cafe',
  'lounge',
  'facade',
]);

// Editor-facing SEO overrides: blank/whitespace values normalize to undefined
// so the page fallback (title/summary) always wins when the field is empty.
// Max 60 chars: SERP results truncate at roughly that length, and Keystatic
// (keystatic.config.ts) enforces the same cap.
const seoTitle = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() ? v.trim() : undefined),
  z.string().max(60).optional(),
);
const seoDescription = z.preprocess(
  (v) => (typeof v === 'string' && v.trim() ? v.trim() : undefined),
  z.string().max(200).optional(),
);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    client: z.string().optional(),
    category: z.enum(['residential', 'hospitality', 'office', 'retail']),
    // Must stay an enum of STYLE_TAGS: the filter UI only offers those six,
    // and a free string here would silently vanish from style filtering.
    style: z.enum(STYLE_TAGS),
    location: z.string(),
    area: z.number().int().min(1),
    year: z.number().int().min(1990).max(2100),
    budget: z.string().optional(),
    services: z.array(z.string()).default([]),
    scene: scenes.default('living'),
    hue: z.number().int().min(0).max(360).default(28),
    gallery: z.array(scenes).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    seoTitle,
    seoDescription,
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    tag: z.string().default('Journal'),
    seoTitle,
    seoDescription,
  }),
});

export const collections = { projects, posts };
