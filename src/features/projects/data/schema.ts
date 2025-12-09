import { z } from 'zod'
import { companySchema } from '@/features/companies/data/schema'
import { contractSchema } from '@/features/contracts/data/schema'
import { networkCategorySchema } from '@/features/network/categories/data/schema'
import { distributionSchema } from '@/features/stakeholder/distributions/data/schema'

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  contract_id: z.string().optional().nullable(),
  price: z.union([z.string(), z.number()]).optional(),
  price_with_qqs: z.union([z.string(), z.number()]).optional(),
  planned_views_count: z.union([z.string(), z.number()]).optional(),
  status: z.string(),
  is_active: z.boolean(),
  is_qqs: z.boolean(),
  distribution_id: z.string(),
  price_type: z.enum(['standard', 'vip', 'no_watermark']),
  category_id: z.string(),
  customer_company_id: z.string(),
  our_company_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  category: networkCategorySchema,
  customer_company: companySchema,
  distribution: distributionSchema,
  our_company: companySchema,
  payment_status: z.string(),
  payment_type: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'DEPOSIT']),
  contract: contractSchema,
  tags: z.array(z.string()).optional(),
  clone_project_id: z.string().optional().nullable(),
})
export type ProjectSchema = z.infer<typeof projectSchema>
