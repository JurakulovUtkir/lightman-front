import z from 'zod'
import { founderSchema } from '../../founders/data/schema'

export const distributorSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
  description: z.string(),
  founder_id: z.string(),
  distribution_id: z.string(),
  percentage: z.number(),
  founder: founderSchema,
})
export type DistributorSchema = z.infer<typeof distributorSchema>
