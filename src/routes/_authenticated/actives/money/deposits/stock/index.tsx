import { createFileRoute } from '@tanstack/react-router'
import EmptyPage from '@/components/empty-page'

export const Route = createFileRoute(
  '/_authenticated/actives/money/deposits/stock/'
)({
  component: EmptyPage,
})
