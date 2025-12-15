import { z } from 'zod'
import { companySchema } from '@/features/companies/data/schema'

export const propertySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  count: z.number(),
  price: z.number(),
  current_price: z.number(),
  is_active: z.boolean(),
  company_id: z.string(),
  status: z.enum([
    'IN_USE',
    'IN_STOCK',
    'REPAIRED',
    'WRITTEN_OFF',
    'SOLD',
    'LOST',
  ]),
  category: z.enum([
    'BUILDING',
    'VEHICLE',
    'EQUIPMENT',
    'FURNITURE',
    'ELECTRONICS',
    'OTHER',
  ]),
  company: companySchema,
  created_at: z.string(),
  updated_at: z.string(),
})
export type PropertySchema = z.infer<typeof propertySchema>
