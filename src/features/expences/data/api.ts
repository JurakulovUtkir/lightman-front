import api from '@/lib/axios'
import { ExpenceSchema } from './schema'
import { ExpenceSchemaResponse } from './types'

export const getExpences = async ({
  limit,
  offset,
  search,
}: {
  limit?: number
  offset?: number
  search?: string
}): Promise<ExpenceSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)

  const response = await api.get(`/expence?${params.toString()}`)
  return response.data
}
export const getExpence = async (id: string): Promise<ExpenceSchema> => {
  const response = await api.get(`/expence/${id}`)
  return response.data
}

export const createExpence = async (
  data: Partial<ExpenceSchema>
): Promise<ExpenceSchema> => {
  const response = await api.post('/expence', data)
  return response.data
}

export const updateExpence = async (
  id: string,
  data: Partial<ExpenceSchema>
): Promise<ExpenceSchema> => {
  const response = await api.patch(`/expence/${id}`, data)
  return response.data
}

export const deleteExpence = async (id: string): Promise<void> => {
  await api.delete(`/expence/${id}`)
}
