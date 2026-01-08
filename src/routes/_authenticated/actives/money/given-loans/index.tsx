import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Loans from '@/features/loans'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
})
export const Route = createFileRoute(
  '/_authenticated/actives/money/given-loans/'
)({
  validateSearch: (search) => searchSchema.parse(search),
  component: () => {
    return <Loans direction='WE_GAVE' />
  },
})
