import { createFileRoute } from '@tanstack/react-router'
import Properties from '@/features/properties'

export const Route = createFileRoute('/_authenticated/actives/properties/')({
  component: Properties,
})
