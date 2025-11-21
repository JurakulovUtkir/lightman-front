import { ApiResponse } from '@/constants'
import { ExpenceSchema } from './schema'

export type ExpenceSchemaResponse = ApiResponse<{
  items: ExpenceSchema[]
  total: number
  limit: number
  offset: number
}>
