import { ApiResponse } from '@/constants'
import { ProjectSchema } from './schema'

export type ProjectSchemaResponse = ApiResponse<{
  items: ProjectSchema[]
  total: number
  limit: number
  offset: number
}>
