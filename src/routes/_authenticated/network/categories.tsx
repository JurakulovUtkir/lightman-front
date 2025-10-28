import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import NetworkCategories from '@/features/network/categories'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
})

export const Route = createFileRoute('/_authenticated/network/categories')({
  validateSearch: (search) => searchSchema.parse(search),
  component: NetworkCategories,
})
