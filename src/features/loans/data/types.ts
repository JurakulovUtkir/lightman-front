import { ApiResponse } from '@/constants'
import { LoanSchema } from './schema'

export type LoanSchemaResponse = ApiResponse<{
  data: LoanSchema[]
  total: number
  limit: number
  offset: number
}>
