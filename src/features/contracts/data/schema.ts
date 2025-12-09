import { z } from 'zod'
import { companySchema } from '@/features/companies/data/schema'

export const contractSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  contract_number: z.string(),
  price: z.union([z.string(), z.number()]).optional(),
  is_qqs: z.boolean(),
  is_active: z.boolean(),
  payment_type: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'DEPOSIT']),
  payment_status: z.enum(['pending']).optional(),
  our_company_id: z.string(),
  file: z.string(),
  customer_company_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  customer_company: companySchema,
  our_company: companySchema,
})
export type ContractSchema = z.infer<typeof contractSchema>
