import { ApiResponse } from '@/constants'
import { NetworkCategorySchema } from './schema'

export type NetworkCategoryResponse = ApiResponse<{
  items: NetworkCategorySchema[]
  total: number
}>
