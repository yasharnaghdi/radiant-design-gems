import { z } from 'zod'

import faqJson from './faq.json'
import portfolioJson from './portfolio.json'
import servicesJson from './services.json'

/* ---------- Schemas ---------- */

export const FaqItemSchema = z.object({
  q: z.string().min(1),
  a: z.string().min(1),
})

export const PortfolioItemSchema = z.object({
  image: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Tailwind grid span classes for the asymmetric bento layout */
  span: z.string().min(1),
})

export const ServiceItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  color: z.enum(['accent-emerald', 'accent-blue', 'accent-purple']),
  rotation: z.string().min(1),
  image: z.string().url(),
})

/* ---------- Inferred TypeScript types ---------- */

export type FaqItem = z.infer<typeof FaqItemSchema>
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>
export type ServiceItem = z.infer<typeof ServiceItemSchema>

/* ---------- Safe validation (parsed once at module load) ---------- */

export interface ValidatedData<T> {
  /** Parsed data, or null when validation failed */
  data: T | null
  /** Human-readable validation issues, or null when valid */
  error: string | null
}

function validate<T>(schema: z.ZodType<T>, raw: unknown, label: string): ValidatedData<T> {
  const result = schema.safeParse(raw)
  if (result.success) {
    return { data: result.data, error: null }
  }
  const issues = result.error.issues
    .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
    .join('; ')
  // Surface the problem loudly in dev/build logs as well
  console.error(`[data] "${label}" failed validation:`, issues)
  return { data: null, error: issues }
}

export const faqData: ValidatedData<FaqItem[]> = validate(
  z.array(FaqItemSchema),
  faqJson,
  'faq.json',
)
export const worksData: ValidatedData<PortfolioItem[]> = validate(
  z.array(PortfolioItemSchema),
  portfolioJson,
  'portfolio.json',
)
export const servicesData: ValidatedData<ServiceItem[]> = validate(
  z.array(ServiceItemSchema),
  servicesJson,
  'services.json',
)
