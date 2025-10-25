import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'

const searchSchema = z.object({
  page: z.number().optional().catch(1),
  size: z.number().optional().catch(10),
})

export const Route = createFileRoute('/_authenticated/users/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: Users,
})
