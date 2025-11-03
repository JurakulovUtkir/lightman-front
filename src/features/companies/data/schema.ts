import { z } from 'zod'

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  stir: z.string(),
  mfo: z.string(),
  bank: z.string(),
  account_number: z.string(),
  balance: z.union([z.string(), z.number()]).optional(),
  is_active: z.boolean(),
  is_our_company: z.boolean(),
  is_vip: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type CompanySchema = z.infer<typeof companySchema>
