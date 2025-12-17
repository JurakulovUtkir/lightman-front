import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { CardsSchema } from './schema'
import { CardsSchemaResponse } from './types'

export const getCards = async ({
  limit,
  offset,
  search,
  company_id,
  card_type,
}: {
  limit?: number
  offset?: number
  search?: string
  company_id?: string
  card_type?: 'card' | 'cash'
}): Promise<CardsSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (company_id !== undefined) params.append('company_id', company_id)
  if (card_type !== undefined) params.append('card_type', card_type)
  if (search) params.append('search', search)

  const response = await api.get(`/cards?${params.toString()}`)
  return response.data
}
export const getCard = async (id: string): Promise<CardsSchema> => {
  const response = await api.get<ApiResponse<CardsSchema>>(`/cards/${id}`)
  return response.data.data
}

export const createCard = async (
  data: Partial<CardsSchema>
): Promise<CardsSchema> => {
  const response = await api.post('/cards', data)
  return response.data
}

export const updateCard = async (
  id: string,
  data: Partial<CardsSchema>
): Promise<CardsSchema> => {
  const response = await api.patch(`/cards/${id}`, data)
  return response.data
}

export const deleteCard = async (id: string): Promise<void> => {
  await api.delete(`/cards/${id}`)
}
