import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { ContractSchema } from './schema'
import { ContractSchemaResponse } from './types'

export const getContracts = async ({
  limit,
  offset,
  search,
  is_active,
  our_company_id,
  customer_company_id,
  payment_status,
  payment_type,
}: {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
  our_company_id?: string
  customer_company_id?: string
  payment_status?: string
  payment_type?: string
}): Promise<ContractSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)
  if (is_active !== undefined) params.append('is_active', is_active.toString())
  if (our_company_id) params.append('our_company_id', our_company_id)
  if (customer_company_id)
    params.append('customer_company_id', customer_company_id)
  if (payment_status) params.append('payment_status', payment_status)
  if (payment_type) params.append('payment_type', payment_type)

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
