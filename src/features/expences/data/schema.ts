import { z } from 'zod'
import { companySchema } from '@/features/companies/data/schema'
import { depositSchema } from '@/features/deposits/data/schema'
import { projectSchema } from '@/features/projects/data/schema'
import { distributionSchema } from '@/features/stakeholder/distributions/data/schema'
import { userSchema } from '@/features/users/data/schema'

export const expenceSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  expence_type: z.enum([
    'salary',
    'avans',
    'project',
    'deposit',
    'other',
    'transfer',
  ]),
  type: z.enum(['expence', 'income', 'deposit']),
  distribution_id: z.string(),
  company_id: z.string(),
  user_id: z.string(),
  deposit_id: z.string(),
  payment_type: z.enum(['CARD', 'BANK_TRANSFER', 'CASH', 'DEPOSIT']),
  amount: z.union([z.string(), z.number()]).optional(),
  description: z.string(),
  file_url: z.string(),
  created_at: z.date().optional(),
  updated_at: z.string(),
  company: companySchema,
  user: userSchema,
  project: projectSchema,
  distribution: distributionSchema,
  to_company_id: z.string().optional(),
  deposit: depositSchema,
  project_social_id: z.string().optional(),
})
export type ExpenceSchema = z.infer<typeof expenceSchema>
