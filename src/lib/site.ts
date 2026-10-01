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
