import { createFileRoute } from '@tanstack/react-router'
import Distributions from '@/features/stakeholder/distributions'

export const Route = createFileRoute(
  '/_authenticated/stakeholder/distribution'
)({
  component: Distributions,
})
