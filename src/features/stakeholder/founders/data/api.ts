import api from '@/lib/axios'
import { FounderSchema } from './schema'
import { FounderResponse } from './types'

export const getFounders = async (): Promise<FounderResponse> => {
  const response = await api.get('/founders')
  return response.data
}
export const getFounder = async (id: string): Promise<FounderSchema> => {
  const response = await api.get(`/founders/${id}`)
  return response.data
}

export const createFounder = async (
  data: Partial<FounderSchema>
): Promise<FounderSchema> => {
  const response = await api.post('/founders', data)
  return response.data
}

export const updateFounder = async (
  id: string,
  data: Partial<FounderSchema>
): Promise<FounderSchema> => {
  const response = await api.patch(`/founders/${id}`, data)
  return response.data
}

export const deleteFounder = async (id: string): Promise<void> => {
  await api.delete(`/founders/${id}`)
}
