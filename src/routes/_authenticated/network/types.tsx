// import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import NetworkTypes from '@/features/network/types'

// const searchSchema = z.object({
//   page: z.number().optional().catch(1),
//   size: z.number().optional().catch(10),
// })

export const Route = createFileRoute('/_authenticated/network/types')({
  //   validateSearch: (search) => searchSchema.parse(search),
  component: NetworkTypes,
})
