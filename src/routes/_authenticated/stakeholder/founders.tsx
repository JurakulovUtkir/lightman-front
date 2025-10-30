import { createFileRoute } from '@tanstack/react-router'
import Founders from '@/features/stakeholder/founders'

export const Route = createFileRoute('/_authenticated/stakeholder/founders')({
  component: Founders,
})
