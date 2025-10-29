import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import NetworkSocials from '@/features/network/socials'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
})

export const Route = createFileRoute('/_authenticated/network/socials')({
  validateSearch: (search) => searchSchema.parse(search),
  component: NetworkSocials,
})
