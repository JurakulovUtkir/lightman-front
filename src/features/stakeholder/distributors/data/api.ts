import api from '@/lib/axios'
import { DistributorSchema } from './schema'
import { DistributorResponse } from './types'

export const getDistributors = async (
  id: string
): Promise<DistributorResponse> => {
  const response = await api.get(`/distributors/distribution/${id}`)
  return response.data
}
export const getDistributor = async (
  id: string
): Promise<DistributorSchema> => {
  const response = await api.get(`/distributors/${id}`)
  return response.data
}

export const createDistributor = async (
  data: Partial<DistributorSchema>
): Promise<DistributorSchema> => {
  const response = await api.post('/distributors', data)
  return response.data
}

export const updateDistributor = async (
  id: string,
  data: Partial<DistributorSchema>
): Promise<DistributorSchema> => {
  const response = await api.patch(`/distributors/${id}`, data)
  return response.data
}

export const deleteDistributor = async (id: string): Promise<void> => {
  await api.delete(`/distributors/${id}`)
}
