import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import FounderExpence from '@/features/stakeholder/founder-expence'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
})

export const Route = createFileRoute(
  '/_authenticated/stakeholder/founders/expence/$id'
)({
  validateSearch: (search) => searchSchema.parse(search),
  component: FounderExpence,
  loader: async ({ params }) => {
    return {
      id: params.id,
    }
  },
})
