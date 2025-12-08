import { z } from 'zod'

export const cardsSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  company_id: z.string(),
  expiration_date: z.date(),
  is_active: z.boolean(),
  balance: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type CardsSchema = z.infer<typeof cardsSchema>
