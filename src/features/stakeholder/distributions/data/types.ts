import { ApiResponse } from '@/constants'
import { DistributionSchema } from './schema'

export type DistributionResponse = ApiResponse<DistributionSchema[]>
