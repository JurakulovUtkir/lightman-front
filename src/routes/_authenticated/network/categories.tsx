import { createFileRoute } from '@tanstack/react-router'
import NetworkCategories from '@/features/network/categories'

export const Route = createFileRoute('/_authenticated/network/categories')({
  component: NetworkCategories,
})
