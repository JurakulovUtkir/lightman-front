import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'

const searchSchema = z.object({
  active: z.string().optional().catch('projects'),
  userId: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: Dashboard,
})
