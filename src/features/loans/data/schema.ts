import { z } from 'zod'

export const loanSchema = z.object({
  id: z.string(),
  direction: z.enum(['WE_GAVE', 'WE_TOOK']),
  counterparty_name: z.string(),
  planned_amount: z.union([z.string(), z.number()]).optional(),
  given_amount: z.union([z.string(), z.number()]).optional(),
  start_date: z.date(),
  due_date: z.date(),
  closed_date: z.date(),
  note: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type LoanSchema = z.infer<typeof loanSchema>
