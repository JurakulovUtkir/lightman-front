import { z } from 'zod'

export const networkTagSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
})
export type NetworkTagSchema = z.infer<typeof networkTagSchema>
