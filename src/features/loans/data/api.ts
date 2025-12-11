import api from '@/lib/axios'
import { LoanSchema } from './schema'
import { LoanSchemaResponse } from './types'

export const getLoans = async ({
  limit,
  offset,
  search,
  direction,
}: {
  limit?: number
  offset?: number
  search?: string
  direction?: 'WE_GAVE' | 'WE_TOOK'
}): Promise<LoanSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (direction !== undefined) params.append('direction', direction)
  if (search) params.append('search', search)

  const response = await api.get(`/loans?${params.toString()}`)
  return response.data
}
export const getLoan = async (id: string): Promise<LoanSchema> => {
  const response = await api.get(`/loans/${id}`)
  return response.data
}

export const createLoan = async (
  data: Partial<LoanSchema>
): Promise<LoanSchema> => {
  const response = await api.post('/loans', data)
  return response.data
}

export const updateLoan = async (
  id: string,
  data: Partial<LoanSchema>
): Promise<LoanSchema> => {
  const response = await api.patch(`/loans/${id}`, data)
  return response.data
}

export const deleteLoan = async (id: string): Promise<void> => {
  await api.delete(`/loans/${id}`)
}
