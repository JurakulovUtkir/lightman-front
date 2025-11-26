import api from '@/lib/axios'
import { ExpenceSchema } from './schema'
import { ExpenceSchemaResponse } from './types'

export const getExpences = async ({
  limit,
  offset,
  search,
  type,
  expence_type,
  payment_type,
  distribution_id,
  company_id,
  project_id,
  user_id,
  date_from,
  date_to,
  max_amount,
  min_amount,
}: {
  limit?: number
  offset?: number
  search?: string
  type?: 'expence' | 'income' | 'deposit'
  expence_type?:
    | 'salary'
    | 'avans'
    | 'project'
    | 'deposit'
    | 'other'
    | 'transfer'
  payment_type?: 'card' | 'bank_transfer' | 'cash' | 'deposit'
  distribution_id?: string
  company_id?: string
  project_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
  max_amount?: number
  min_amount?: number
}): Promise<ExpenceSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)
  if (type) params.append('type', type)
  if (expence_type) params.append('expence_type', expence_type)
  if (payment_type) params.append('payment_type', payment_type)
  if (distribution_id) params.append('distribution_id', distribution_id)
  if (company_id) params.append('company_id', company_id)
  if (project_id) params.append('project_id', project_id)
  if (user_id) params.append('user_id', user_id)
  if (date_from) params.append('date_from', date_from)
  if (date_to) params.append('date_to', date_to)
  if (max_amount !== undefined)
    params.append('max_amount', max_amount.toString())
  if (min_amount !== undefined)
    params.append('min_amount', min_amount.toString())

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
