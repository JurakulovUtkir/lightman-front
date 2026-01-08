import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import Cards from '@/features/companies/cards'

const searchSchema = z.object({
  offset: z.number().optional().catch(0),
  limit: z.number().optional().catch(20),
})

export const Route = createFileRoute('/_authenticated/actives/money/cash/')({
  validateSearch: (search) => searchSchema.parse(search),
  component: () => {
    return <Cards type='cash' />
  },
})
