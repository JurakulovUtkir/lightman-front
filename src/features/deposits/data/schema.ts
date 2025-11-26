import { z } from 'zod'

export const depositSchema = z.object({
  id: z.string(),
  name: z.string(),
  balance: z.union([z.string(), z.number()]).optional(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type DepositSchema = z.infer<typeof depositSchema>
