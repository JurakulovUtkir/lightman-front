import { ApiResponse } from '@/constants'
import { CompanySchema } from './schema'

export type CompanySchemaResponse = ApiResponse<{
  items: CompanySchema[]
  total: number
  limit: number
  offset: number
}>
