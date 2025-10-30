import { createFileRoute } from '@tanstack/react-router'
import Distrubitions from '@/features/stakeholder/distrubitions'

export const Route = createFileRoute(
  '/_authenticated/stakeholder/distrubitions'
)({
  component: Distrubitions,
})
