import { createFileRoute } from '@tanstack/react-router'
import Actions from '@/features/actions'

export const Route = createFileRoute('/_authenticated/actions/')({
  component: Actions,
})
