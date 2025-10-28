import { z } from 'zod'

export const networkTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
})
export type NetworkTypeSchema = z.infer<typeof networkTypeSchema>
