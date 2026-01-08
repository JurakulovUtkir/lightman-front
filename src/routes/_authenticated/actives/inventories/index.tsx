import { createFileRoute } from '@tanstack/react-router'
import Inventories from '@/features/actives/inventories'

export const Route = createFileRoute('/_authenticated/actives/inventories/')({
  component: Inventories,
})
