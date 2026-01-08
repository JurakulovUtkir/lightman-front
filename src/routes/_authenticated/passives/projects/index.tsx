import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Projects from '@/features/projects'

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
  project_manager_id: z.string().optional().catch(''),
  category_id: z.string().optional().catch(''),
  distribution_id: z.string().optional().catch(''),
  min_price: z.number().optional().catch(undefined),
  max_price: z.number().optional().catch(undefined),
  active_tab: z
    .enum([
      'active',
      'on_hold',
      'approved',
      'requested',
      'done',
      'canceled',
      'requested_to_done',
    ])
    .optional()
    .catch('active'),
})

export const Route = createFileRoute('/_authenticated/passives/projects/')({
  validateSearch: (search) => searchSchema.parse(search),

  component: () => {
    return <Projects passive={true} />
  },
})
