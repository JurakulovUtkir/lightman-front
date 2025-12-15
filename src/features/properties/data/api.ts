import api from '@/lib/axios'
import { PropertySchema } from './schema'
import { PropertySchemaResponse } from './types'

export const getProperties = async () //   {
//       limit,
//       offset,
//       search,
//   }: {
//       limit?: number
//       offset?: number
//       search?: string
//   }
: Promise<PropertySchemaResponse> => {
  //   const params = new URLSearchParams()

  //   if (limit !== undefined) params.append('limit', limit.toString())
  //   if (offset !== undefined) params.append('offset', offset.toString())
  //   if (search) params.append('search', search)

  const response = await api.get(`/properties`)
  return response.data
}
export const getProperty = async (id: string): Promise<PropertySchema> => {
  const response = await api.get(`/properties/${id}`)
  return response.data
}

export const createProperty = async (
  data: Partial<PropertySchema>
): Promise<PropertySchema> => {
  const response = await api.post('/properties', data)
  return response.data
}

export const updateProperty = async (
  id: string,
  data: Partial<PropertySchema>
): Promise<PropertySchema> => {
  const response = await api.patch(`/properties/${id}`, data)
  return response.data
}

export const deleteProperty = async (id: string): Promise<void> => {
  await api.delete(`/properties/${id}`)
}
