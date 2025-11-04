import api from '@/lib/axios'
import { NetworkSocialSchema } from './schema'
import { NetworkSocialResponse } from './types'

export const getSocials = async ({
  limit,
  offset,
  search,
  category_id,
  social_network_type_id,
}: {
  limit?: number
  offset?: number
  search?: string
  category_id?: string
  social_network_type_id?: string
}): Promise<NetworkSocialResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', String(limit))
  if (offset !== undefined) params.append('offset', String(offset))
  if (search) params.append('search', search)
  if (category_id) params.append('category_id', category_id)
  if (social_network_type_id)
    params.append('social_network_type_id', social_network_type_id)

  const response = await api.get(`/socials?${params.toString()}`)
  return response.data
}

export const getSocial = async (id: string): Promise<NetworkSocialSchema> => {
  const response = await api.get(`/socials/${id}`)
  return response.data
}

export const createSocial = async (
  data: Partial<NetworkSocialSchema>
): Promise<NetworkSocialSchema> => {
  const response = await api.post('/socials', data)
  return response.data
}

export const updateSocial = async (
  id: string,
  data: Partial<NetworkSocialSchema>
): Promise<NetworkSocialSchema> => {
  const response = await api.patch(`/socials/${id}`, data)
  return response.data
}

export const deleteSocial = async (id: string): Promise<void> => {
  await api.delete(`/socials/${id}`)
}
