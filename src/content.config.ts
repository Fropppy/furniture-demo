import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    client: z.string().optional(),
    category: z.enum(['residential', 'hospitality', 'office', 'retail']),
    style: z.string(),
    location: z.string(),
    area: z.number(),
    year: z.number(),
    budget: z.string().optional(),
    services: z.array(z.string()).default([]),
    scene: scenes.default('living'),
    hue: z.number().min(0).max(360).default(28),
    gallery: z.array(scenes).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.coerce.date(),
    tag: z.string().default('Journal'),
  }),
});

export const collections = { projects, posts };
