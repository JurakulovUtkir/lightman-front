import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import NetworkTags from '@/features/network/tags'

const searchSchema = z.object({
  offset: z.number().optional().catch(1),
  limit: z.number().optional().catch(20),
})

export const Route = createFileRoute('/_authenticated/network/tags')({
  validateSearch: (search) => searchSchema.parse(search),
  component: NetworkTags,
})
