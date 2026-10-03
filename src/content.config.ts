import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
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
// VI variants: same blank-tolerant preprocessing; empty falls back to EN.
const seoTitleVi = seoTitle;
const seoDescriptionVi = seoDescription;

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  // `image` comes from the schema-function argument (the astro:content import
  // was removed in Astro 3). It resolves a frontmatter path RELATIVE TO THE
  // ENTRY FILE into ImageMetadata and fails the build if the file is missing.
  schema: ({ image }) =>
    z.object({
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
      // Real photography (Keystatic uploads land in src/assets/images/projects/).
      // Templates fall back to the SVG illustrations when these are absent.
      // Alt text is required here, not optional — cover art is content
      // (WCAG 1.1.1), and the editor can't save without it in Keystatic.
      cover: z
        .object({
          image: image(),
          alt: z.string().min(1),
          caption: z.string().optional(),
        })
        .optional(),
      photos: z
        .array(
          z.object({
            image: image(),
            alt: z.string().min(1),
            caption: z.string().optional(),
          }),
        )
        .optional(),
      featured: z.boolean().default(false),
      order: z.number().default(99),
      // Vietnamese fields (site default is EN; VI pages fall back per-field)
      titleVi: z.string().optional(),
      summaryVi: z.string().optional(),
      clientVi: z.string().optional(),
      locationVi: z.string().optional(),
      budgetVi: z.string().optional(),
      servicesVi: z.array(z.string()).optional(),
      seoTitle,
      seoDescription,
      seoTitleVi,
      seoDescriptionVi,
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    tag: z.string().default('Journal'),
    titleVi: z.string().optional(),
    excerptVi: z.string().optional(),
    seoTitle,
    seoDescription,
    seoTitleVi,
    seoDescriptionVi,
  }),
});

export const collections = { projects, posts };
