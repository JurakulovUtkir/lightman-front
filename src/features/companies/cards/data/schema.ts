import { z } from 'zod'
import { distributionSchema } from '@/features/stakeholder/distributions/data/schema'
import { companySchema } from '../../data/schema'

export const cardsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
  company: companySchema,
  distribution_id: z.string(),
  distribution: distributionSchema,
  expiration_date: z.date(),
  is_active: z.boolean(),
  balance: z.union([z.string(), z.number()]),
  card_type: z.enum(['cash', 'card']),
  created_at: z.string(),
  updated_at: z.string(),
})
export type CardsSchema = z.infer<typeof cardsSchema>
