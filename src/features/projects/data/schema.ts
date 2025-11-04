import { z } from 'zod'

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  contract_id: z.string().optional().nullable(),
  price: z.union([z.string(), z.number()]).optional(),
  price_with_qqs: z.union([z.string(), z.number()]).optional(),
  status: z.string(),
  is_active: z.boolean(),
  distribution_id: z.string(),
  price_type: z.string(),
  category_id: z.string(),
  customer_company_id: z.string(),
  our_company_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ProjectSchema = z.infer<typeof projectSchema>
