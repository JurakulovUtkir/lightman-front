import { ApiResponse } from '@/constants'
import { NetworkSocialSchema } from './schema'

export type NetworkSocialResponse = ApiResponse<{
  items: NetworkSocialSchema[]
  total: number
  limit: number
  offset: number
}>
