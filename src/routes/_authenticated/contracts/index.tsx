import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Contracts from '@/features/contracts'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
  payment_status: z
    .enum(['pending', 'paid', 'cancelled', 'unpaid'])
    .optional()
    .catch(undefined),
  payment_type: z
    .enum(['card', 'bank_transfer', 'cash', 'deposit'])
    .optional()
    .catch(undefined),
  customer_company_id: z.string().optional().catch(''),
  our_company_id: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/contracts/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: Contracts,
})
