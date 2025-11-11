import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Contracts from '@/features/contracts'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
})

export const Route = createFileRoute('/_authenticated/contracts/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: Contracts,
})
