/**
 * Central site config — change brand strings and links here.
 */
export const SITE = {
  name: 'FORMA Studio',
  tagline: 'Interior & Furniture Design',
  description:
    'FORMA Studio is an interior and furniture design practice crafting residential, hospitality, workplace and retail spaces — from concept and joinery detail to turnkey fit-out.',
  phone: '+84 90 123 4567',
  email: 'hello@formastudio.vn',
  address: '24 Ly Quoc Su, Hoan Kiem, Hanoi, Vietnam',
  social: {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    pinterest: 'https://pinterest.com/',
    behance: 'https://behance.net/',
  },
};

/**
 * Prefix an internal path with the configured deploy base so the site works
 * both at a domain root (Vercel) and under /repo/ (GitHub Pages).
 */
export function withBase(path: string): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path;
}

/**
 * JSON-LD payload escaping: JSON.stringify does not escape "<", so a
 * "</script>" sequence inside CMS-authored strings could break out of the
 * ld+json element into HTML context. Escape every "<" as \u003c.
 */
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * Shared date formatting (en-GB, e.g. "12 August 2025") so journal listings,
 * article pages and the home teaser stay identical.
 */
export function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Contact-form delivery. Submissions POST JSON to a Web3Forms-compatible
 * endpoint and arrive in the studio's admin inbox. The access key is
 * designed to be public (it only allows sending TO the registered inbox).
 * Set PUBLIC_FORM_ACCESS_KEY in .env — see README "Contact form".
 */
export const FORM = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: import.meta.env.PUBLIC_FORM_ACCESS_KEY ?? '',
  fromName: SITE.name,
  subject: 'New project enquiry — forma website',
};

export const CATEGORIES = {
  residential: 'Residential',
  hospitality: 'Hospitality',
  office: 'Workplace',
  retail: 'Retail',
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const STYLE_TAGS = [
  'Japandi',
  'Modern Tropical',
  'Minimalist',
  'Contemporary Classic',
  'Industrial',
  'Modern Luxury',
] as const;

export type AreaBand = 'under-150' | '150-400' | '400-1000' | 'over-1000';

export const AREA_BANDS: { value: AreaBand; label: string }[] = [
  { value: 'under-150', label: 'Under 150 m²' },
  { value: '150-400', label: '150 – 400 m²' },
  { value: '400-1000', label: '400 – 1,000 m²' },
  { value: 'over-1000', label: 'Over 1,000 m²' },
];

export function areaBand(area: number): AreaBand {
  if (area < 150) return 'under-150';
  if (area < 400) return '150-400';
  if (area <= 1000) return '400-1000';
  return 'over-1000';
}
