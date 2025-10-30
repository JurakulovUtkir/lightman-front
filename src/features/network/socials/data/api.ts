import api from '@/lib/axios'
import { NetworkSocialSchema } from './schema'
import { NetworkSocialResponse } from './types'

export const getSocials = async ({
  limit,
  offset,
  category_id,
  social_network_type_id,
}: {
  limit?: number
  offset?: number
  category_id?: string
  social_network_type_id?: string
}): Promise<NetworkSocialResponse> => {
  const response = await api.get(
    `/socials?limit=${limit}&offset=${offset}${category_id ? `&category_id=${category_id}` : ``}${social_network_type_id ? `&social_network_type_id=${social_network_type_id}` : ``}`
  )
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
