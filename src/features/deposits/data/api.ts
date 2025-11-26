import api from '@/lib/axios'
import { DepositSchema } from './schema'
import { DepositSchemaResponse } from './types'

export const getDeposits = async ({
  limit,
  offset,
  search,
}: {
  limit?: number
  offset?: number
  search?: string
}): Promise<DepositSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)

  const response = await api.get(`/deposits?${params.toString()}`)
  return response.data
}
export const getDeposit = async (id: string): Promise<DepositSchema> => {
  const response = await api.get(`/deposits/${id}`)
  return response.data
}

export const createDeposit = async (
  data: Partial<DepositSchema>
): Promise<DepositSchema> => {
  const response = await api.post('/deposits', data)
  return response.data
}

export const updateDeposit = async (
  id: string,
  data: Partial<DepositSchema>
): Promise<DepositSchema> => {
  const response = await api.patch(`/deposits/${id}`, data)
  return response.data
}

export const deleteDeposit = async (id: string): Promise<void> => {
  await api.delete(`/deposits/${id}`)
}
