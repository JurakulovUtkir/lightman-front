import { createFileRoute } from '@tanstack/react-router'
import NetworkSocials from '@/features/network/socials'

export const Route = createFileRoute('/_authenticated/network/socials')({
  component: NetworkSocials,
})
