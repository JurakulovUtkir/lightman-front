import { ApiResponse } from '@/constants'
import { NetworkTagSchema } from './schema'

export type NetworkTagResponse = ApiResponse<{
  items: NetworkTagSchema[]
  total: number
}>
