import { ApiResponse } from '@/constants'
import { CardsSchema } from './schema'

export type CardsSchemaResponse = ApiResponse<{
  data: CardsSchema[]
  total: number
  limit: number
  offset: number
}>
