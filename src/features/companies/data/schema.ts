import { z } from 'zod'
import { distributionSchema } from '@/features/stakeholder/distributions/data/schema'

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  stir: z.string(),
  mfo: z.string(),
  pinfl: z.string(),
  bank: z.string(),
  account_number: z.string(),
  balance: z.union([z.string(), z.number()]).optional(),
  is_active: z.boolean(),
  is_our_company: z.boolean(),
  is_vip: z.boolean(),
  is_qqs: z.boolean(),
  distribution_id: z.string(),
  distribution: distributionSchema,
  created_at: z.string(),
  updated_at: z.string(),
})
export type CompanySchema = z.infer<typeof companySchema>
