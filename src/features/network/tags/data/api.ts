import api from '@/lib/axios'
import { NetworkTagSchema } from './schema'
import { NetworkTagResponse } from './types'

export const getNetworkTags = async ({
  offset,
  limit,
  search,
}: {
  offset?: number
  limit?: number
  search?: string
}): Promise<NetworkTagResponse> => {
  const params = new URLSearchParams()

  if (offset !== undefined) params.append('offset', String(offset))
  if (limit !== undefined) params.append('limit', String(limit))
  if (search) params.append('search', search)

  const response = await api.get(`/tags?${params.toString()}`)
  return response.data
}

export const getNetworkTag = async (id: string): Promise<NetworkTagSchema> => {
  const response = await api.get(`/tags/${id}`)
  return response.data
}

export const createNetworkTag = async (
  data: Partial<NetworkTagSchema>
): Promise<NetworkTagSchema> => {
  const response = await api.post('/tags', data)
  return response.data
}

export const updateNetworkTag = async (
  id: string,
  data: Partial<NetworkTagSchema>
): Promise<NetworkTagSchema> => {
  const response = await api.patch(`/tags/${id}`, data)
  return response.data
}

export const deleteNetworkTag = async (id: string): Promise<void> => {
  await api.delete(`/tags/${id}`)
}
