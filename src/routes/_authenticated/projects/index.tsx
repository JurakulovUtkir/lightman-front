import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Projects from '@/features/projects'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
})

export const Route = createFileRoute('/_authenticated/projects/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: Projects,
})
