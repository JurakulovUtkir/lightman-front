import { ApiResponse } from '@/constants'
import { DepositSchema } from './schema'

export type DepositSchemaResponse = ApiResponse<{
  data: DepositSchema[]
  total: number
  limit: number
  offset: number
}>
