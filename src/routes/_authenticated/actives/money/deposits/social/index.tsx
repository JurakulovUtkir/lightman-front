import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import NetworkSocials from '@/features/network/socials'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
  category_id: z.string().optional().catch(''),
  social_network_type_id: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/actives/money/deposits/social/'
)({
  validateSearch: (search) => searchSchema.parse(search),
  component: () => {
    return <NetworkSocials isMain={false} />
  },
})
