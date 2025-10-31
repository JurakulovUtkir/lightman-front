import { createFileRoute } from '@tanstack/react-router'
import Distributors from '@/features/stakeholder/distributors'

export const Route = createFileRoute(
  '/_authenticated/stakeholder/distributors/$id'
)({
  component: Distributors,
  loader: async ({ params }) => {
    return {
      id: params.id,
    }
  },
})
