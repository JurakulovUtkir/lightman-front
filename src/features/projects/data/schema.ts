import { z } from 'zod'
import { PaymentType } from '@/constants/enums'
import { companySchema } from '@/features/companies/data/schema'
import { contractSchema } from '@/features/contracts/data/schema'
import { networkCategorySchema } from '@/features/network/categories/data/schema'
import { distributionSchema } from '@/features/stakeholder/distributions/data/schema'
import { userSchema } from '@/features/users/data/schema'

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  contract_id: z.string().optional().nullable(),
  price: z.union([z.string(), z.number()]).optional(),
  price_with_qqs: z.union([z.string(), z.number()]).optional(),
  planned_views_count: z.union([z.string(), z.number()]).optional(),
  status: z.enum([
    'draft',
    'active',
    'on_hold',
    'approved',
    'requested',
    'done',
    'canceled',
    'requested_to_done',
  ]),
  pendingStatus: z.enum([
    'draft',
    'active',
    'on_hold',
    'approved',
    'requested',
    'done',
    'canceled',
    'requested_to_done',
  ]),
  is_active: z.boolean(),
  is_qqs: z.boolean(),
  distribution_id: z.string(),
  distribution: distributionSchema,
  price_type: z.enum(['standard', 'vip', 'no_watermark']),
  category_id: z.string(),
  customer_company_id: z.string(),
  our_company_id: z.string(),
  project_manager_id: z.string(),
  project_manager: userSchema,
  created_at: z.string(),
  updated_at: z.string(),
  category: networkCategorySchema,
  customer_company: companySchema,
  our_company: companySchema,
  payment_status: z.enum(['PENDING', 'PAID', 'UNPAID', 'CANCELLED']),
  payment_type: z
    .enum([
      PaymentType.CARD,
      PaymentType.CASH,
      PaymentType.BANK_TRANSFER,
      PaymentType.DEPOSIT,
    ])
    .optional()
    .catch(undefined),
  contract: contractSchema,
  tags: z.array(z.string()).optional(),
  clone_project_id: z.string().optional().nullable(),
  categories: z.array(z.string()).optional(),
})
export type ProjectSchema = z.infer<typeof projectSchema>
