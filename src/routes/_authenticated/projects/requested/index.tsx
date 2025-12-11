import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Requested from '@/features/projects/project-requested'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
  status: z
    .enum([
      'draft',
      'active',
      'on_hold',
      'approved',
      'requested',
      'done',
      'canceled',
    ])
    .optional()
    .catch(undefined),
  price_type: z
    .enum(['standard', 'vip', 'no_watermark'])
    .optional()
    .catch(undefined),
  customer_company_id: z.string().optional().catch(''),
  our_company_id: z.string().optional().catch(''),
  category_id: z.string().optional().catch(''),
  distribution_id: z.string().optional().catch(''),
  min_price: z.number().optional().catch(undefined),
  max_price: z.number().optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/projects/requested/')({
  validateSearch: (search) => searchSchema.parse(search),

  component: Requested,
})
