import { createFileRoute } from '@tanstack/react-router'
import Localization from '@/features/settings/localization'

export const Route = createFileRoute('/_authenticated/settings/localization')({
  component: Localization,
})
