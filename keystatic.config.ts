import { config, fields, collection, type KeystaticConfig } from '@keystatic/core';
import { STYLE_TAGS } from './src/lib/site';

/**
 * This mirrors the Zod schemas in src/content.config.ts — keep them in sync.
 * Fields marked optional in Zod are optional here (no validation.isRequired).
 */
const SCENE_OPTIONS = [
  { label: 'Living room', value: 'living' },
  { label: 'Bedroom', value: 'bedroom' },
  { label: 'Kitchen', value: 'kitchen' },
  { label: 'Dining', value: 'dining' },
  { label: 'Office', value: 'office' },
  { label: 'Café', value: 'cafe' },
  { label: 'Lounge / bar', value: 'lounge' },
  { label: 'Facade', value: 'facade' },
];

const CATEGORY_OPTIONS = [
  { label: 'Residential', value: 'residential' },
  { label: 'Hospitality', value: 'hospitality' },
  { label: 'Workplace', value: 'office' },
  { label: 'Retail', value: 'retail' },
];

const projects = collection({
  label: 'Projects',
  slugField: 'title',
  path: 'src/content/projects/*',
  format: { contentField: 'content' },
  previewUrl: '/projects/{slug}/',
  columns: ['title', 'category', 'year', 'featured'],
  schema: {
    title: fields.slug({
      name: { label: 'Title', validation: { length: { max: 80 } } },
    }),
    summary: fields.text({
      label: 'Summary',
      validation: { isRequired: true, length: { max: 320 } },
    }),
    client: fields.text({ label: 'Client' }),
    category: fields.select({
      label: 'Category',
      options: CATEGORY_OPTIONS,
      defaultValue: 'residential',
    }),
    style: fields.select({
      label: 'Style',
      // Single source of truth with the zod schema (content.config.ts).
      options: STYLE_TAGS.map((s) => ({ label: s, value: s })),
      defaultValue: 'Minimalist',
    }),
    location: fields.text({ label: 'Location', validation: { isRequired: true } }),
    area: fields.integer({
      label: 'Floor area (m²)',
      validation: { min: 1 },
      defaultValue: 100,
    }),
    year: fields.integer({
      label: 'Year',
      validation: { min: 1990, max: 2100 },
      defaultValue: new Date().getFullYear(),
    }),
    budget: fields.text({ label: 'Investment (display text, e.g. “3.2 billion VND”)' }),
    services: fields.array(fields.text({ label: 'Service' }), {
      label: 'Services',
      itemLabel: (props) => props.value || 'Service',
    }),
    scene: fields.select({
      label: 'Cover illustration',
      options: SCENE_OPTIONS,
      defaultValue: 'living',
    }),
    hue: fields.integer({
      label: 'Cover hue (0–360)',
      validation: { min: 0, max: 360 },
      defaultValue: 28,
    }),
    // Photo fields write files into src/assets/images/projects/<slug>/ and
    // store a path RELATIVE TO the entry file (…/../assets/…) — the exact
    // pattern of Keystatic's official Astro template, so Astro's image()
    // schema helper resolves it and optimizes at build. Keep the relative
    // prefix; a leading '/' here would break astro:assets resolution.
    cover: fields.object(
      {
        image: fields.image({
          label: 'Cover photo',
          directory: 'src/assets/images/projects',
          publicPath: '../../assets/images/projects/',
          validation: { isRequired: true },
          description:
            'Landscape JPG/WebP, long edge ≤ 2560px, under ~500KB. Leave the whole Cover photo group empty to keep the illustration.',
        }),
        alt: fields.text({
          label: 'Cover alt text',
          validation: { isRequired: true },
          description:
            'One sentence describing the photo in context, e.g. “Living room with walnut shelving and linen sofa in natural light”.',
        }),
        caption: fields.text({
          label: 'Caption (optional)',
          multiline: true,
        }),
      },
      { label: 'Cover photo' },
    ),
    photos: fields.array(
      fields.object(
        {
          image: fields.image({
            label: 'Photo',
            directory: 'src/assets/images/projects',
            publicPath: '../../assets/images/projects/',
            validation: { isRequired: true },
            description: 'JPG/WebP, long edge ≤ 2560px, under ~500KB.',
          }),
          alt: fields.text({
            label: 'Alt text',
            validation: { isRequired: true },
            description:
              'Room type + key feature + viewpoint, e.g. “Kitchen with terrazzo island, seen from the dining table”.',
          }),
          caption: fields.text({
            label: 'Caption (optional)',
            multiline: true,
          }),
        },
        { label: 'Photo' },
      ),
      {
        label: 'Photo gallery',
        itemLabel: (props) => props.fields.alt.value || 'Photo',
        description:
          'Shown instead of the illustration gallery when it has at least one photo.',
      },
    ),
    gallery: fields.multiselect({
      label: 'Gallery scenes',
      options: SCENE_OPTIONS,
      defaultValue: [],
    }),
    featured: fields.checkbox({ label: 'Featured on home hero', defaultValue: false }),
    order: fields.integer({ label: 'Sort order', defaultValue: 99 }),
    seoTitle: fields.text({
      label: 'SEO title override (≤ 60 chars)',
      validation: { length: { max: 60 } },
    }),
    seoDescription: fields.text({
      label: 'SEO meta description override (~150–160 chars)',
      validation: { length: { max: 200 } },
    }),
    content: fields.markdoc({
      label: 'Project write-up',
      extension: 'md', // must match existing .md files (default is .mdoc)
      // Lets the editor insert images into the body text; files land in the
      // same per-project folder and Astro optimizes them like cover/photos.
      options: {
        image: {
          directory: 'src/assets/images/projects',
          publicPath: '../../assets/images/projects/',
        },
      },
    }),
  },
});

const posts = collection({
  label: 'Journal',
  slugField: 'title',
  path: 'src/content/posts/*',
  format: { contentField: 'content' },
  previewUrl: '/journal/{slug}/',
  columns: ['title', 'date', 'tag'],
  schema: {
    title: fields.slug({
      name: { label: 'Title', validation: { length: { max: 80 } } },
    }),
    excerpt: fields.text({
      label: 'Excerpt',
      validation: { isRequired: true, length: { max: 320 } },
    }),
    date: fields.date({ label: 'Date', validation: { isRequired: true } }),
    tag: fields.text({ label: 'Tag', defaultValue: 'Journal' }),
    seoTitle: fields.text({
      label: 'SEO title override (≤ 60 chars)',
      validation: { length: { max: 60 } },
    }),
    seoDescription: fields.text({
      label: 'SEO meta description override (~150–160 chars)',
      validation: { length: { max: 200 } },
    }),
    content: fields.markdoc({
      label: 'Article body',
      extension: 'md',
    }),
  },
});

export default config({
  storage: { kind: 'local' },
  // For client editing via GitHub, switch to Keystatic Cloud (free ≤ 3 users):
  //   storage: { kind: 'cloud' },
  //   cloud: { project: '<team>/<project>' },
  // and deploy with an SSR adapter (ENABLE_KEYSTATIC=1), see README.
  collections: { projects, posts },
} satisfies KeystaticConfig);
