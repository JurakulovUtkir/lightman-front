import { ApiResponse } from '@/constants'
import { ContractSchema } from './schema'

export type ContractSchemaResponse = ApiResponse<{
  items: ContractSchema[]
  total: number
  limit: number
  offset: number
}>
