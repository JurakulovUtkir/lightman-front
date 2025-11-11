import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { ContractSchema } from './schema'
import { ContractSchemaResponse } from './types'

export const getContracts = async ({
  limit,
  offset,
  search,
  is_active,
}: {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
}): Promise<ContractSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)
  if (is_active !== undefined) params.append('is_active', is_active.toString())

  const response = await api.get(`/contracts?${params.toString()}`)
  return response.data
}
export const getContract = async (id: string): Promise<ContractSchema> => {
  const response = await api.get<ApiResponse<ContractSchema>>(
    `/contracts/${id}`
  )
  return response.data.data
}

export const createContract = async (
  data: Partial<ContractSchema>
): Promise<ContractSchema> => {
  const response = await api.post('/contracts', data)
  return response.data
}

export const updateContract = async (
  id: string,
  data: Partial<ContractSchema>
): Promise<ContractSchema> => {
  const response = await api.patch(`/contracts/${id}`, data)
  return response.data
}

export const deleteContract = async (id: string): Promise<void> => {
  await api.delete(`/contracts/${id}`)
}
