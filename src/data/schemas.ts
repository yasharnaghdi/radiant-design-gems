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

/* ---------- Validated data (parsed once at module load) ---------- */

export const faqs: FaqItem[] = z.array(FaqItemSchema).parse(faqJson)
export const works: PortfolioItem[] = z
  .array(PortfolioItemSchema)
  .parse(portfolioJson)
export const services: ServiceItem[] = z
  .array(ServiceItemSchema)
  .parse(servicesJson)
