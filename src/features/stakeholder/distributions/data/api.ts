import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { DistributionSchema } from './schema'
import { DistributionResponse } from './types'

export const getDistributions = async (): Promise<DistributionResponse> => {
  const response = await api.get('/distribution')
  return response.data
}
export const getDistribution = async (
  id: string
): Promise<DistributionSchema> => {
  const response = await api.get<ApiResponse<DistributionSchema>>(
    `/distribution/${id}`
  )
  return response.data.data
}

export const createDistribution = async (
  data: Partial<DistributionSchema>
): Promise<DistributionSchema> => {
  const response = await api.post('/distribution', data)
  return response.data
}

export const updateDistribution = async (
  id: string,
  data: Partial<DistributionSchema>
): Promise<DistributionSchema> => {
  const response = await api.patch(`/distribution/${id}`, data)
  return response.data
}

export const deleteDistribution = async (id: string): Promise<void> => {
  await api.delete(`/distribution/${id}`)
}
