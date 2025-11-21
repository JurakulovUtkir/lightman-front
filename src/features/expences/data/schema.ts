import { z } from 'zod'
import { companySchema } from '@/features/companies/data/schema'
import { userSchema } from '@/features/users/data/schema'

export const expenceSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  expence_type: z.enum(['salary', 'avans', 'project', 'deposit', 'other']),
  type: z.enum(['expence', 'income', 'deposit']),
  distribution_id: z.string(),
  company_id: z.string(),
  user_id: z.string(),
  payment_type: z.enum(['card', 'bank_transfer', 'cash', 'deposit']),
  amount: z.union([z.string(), z.number()]).optional(),
  description: z.string(),
  file_url: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  company: companySchema,
  user: userSchema,
})
export type ExpenceSchema = z.infer<typeof expenceSchema>
