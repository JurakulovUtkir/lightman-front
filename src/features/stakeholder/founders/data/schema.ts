import { z } from 'zod'

export const founderSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_active: z.boolean(),
  balance: z.number(),
})
export type FounderSchema = z.infer<typeof founderSchema>
