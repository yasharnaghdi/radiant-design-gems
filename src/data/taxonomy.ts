/** Shared vocabulary for onboarding and jury pre-evaluation. */

export const CATEGORIES = [
  'Commercial',
  'Cinematography',
  'Color',
  'Post-Production',
  'Studio',
  'Delivery',
] as const

export const GENRES = [
  'Sci-Fi',
  'Drama',
  'Documentary',
  'Adventure',
  'Thriller',
  'Fantasy',
  'Experimental',
  'Lifestyle',
] as const

export const PERSONAS = [
  'Director',
  'Cinematographer',
  'Colorist',
  'Editor',
  'Producer',
  'Sound Designer',
  'Concept Artist',
] as const

export const CAREER_STAGES = [
  'Emerging talent',
  'Building a reel',
  'Working professional',
  'Established creator',
] as const

export const CAREER_GOALS = [
  'Win festival recognition',
  'Land commercial clients',
  'Join a studio team',
  'Build a signature visual style',
  'Direct my first feature',
] as const

export type Category = (typeof CATEGORIES)[number]
export type Genre = (typeof GENRES)[number]
