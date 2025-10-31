import { z } from 'zod'

export const distributionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
})
export type DistributionSchema = z.infer<typeof distributionSchema>
