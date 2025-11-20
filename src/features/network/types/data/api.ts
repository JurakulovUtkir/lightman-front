import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { NetworkTypeSchema } from './schema'
import { NetworkTypeResponse } from './types'

export const getNetworkTypes = async (): Promise<NetworkTypeResponse> => {
  const response = await api.get('/network-types')
  return response.data
}
export const getNetworkType = async (
  id: string
): Promise<NetworkTypeSchema> => {
  const response = await api.get(`/network-types/${id}`)
  return response.data
}

export const createNetworkType = async (
  data: Partial<NetworkTypeSchema>
): Promise<ApiResponse<NetworkTypeSchema>> => {
  const response = await api.post('/network-types', data)
  return response.data
}

export const updateNetworkType = async (
  id: string,
  data: Partial<NetworkTypeSchema>
): Promise<NetworkTypeSchema> => {
  const response = await api.patch(`/network-types/${id}`, data)
  return response.data
}

export const deleteNetworkType = async (id: string): Promise<void> => {
  await api.delete(`/network-types/${id}`)
}
