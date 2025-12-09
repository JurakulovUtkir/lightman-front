import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Expences from '@/features/expences'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
  type: z.enum(['expence', 'income', 'deposit']).optional().catch(undefined),
  expence_type: z
    .enum(['salary', 'avans', 'project', 'deposit', 'other', 'transfer'])
    .optional()
    .catch(undefined),
  payment_type: z
    .enum(['CARD', 'BANK_TRANSFER', 'CASH', 'DEPOSIT'])
    .optional()
    .catch(undefined),
  distribution_id: z.string().optional().catch(''),
  company_id: z.string().optional().catch(''),
  project_id: z.string().optional().catch(''),
  user_id: z.string().optional().catch(''),
  date_from: z.string().optional().catch(''),
  date_to: z.string().optional().catch(''),
  min_amount: z.number().optional().catch(undefined),
  max_amount: z.number().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/expences/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: Expences,
})
