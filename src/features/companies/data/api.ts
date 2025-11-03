import api from '@/lib/axios'
import { CompanySchema } from './schema'
import { CompanySchemaResponse } from './types'

export const getCompanies = async ({
  limit,
  offset,
  search,
  is_active,
  is_our_company,
  is_vip,
}: {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
  is_our_company?: boolean
  is_vip?: boolean
}): Promise<CompanySchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)
  if (is_active !== undefined) params.append('is_active', is_active.toString())
  if (is_our_company !== undefined)
    params.append('is_our_company', is_our_company.toString())
  if (is_vip !== undefined) params.append('is_vip', is_vip.toString())

  const response = await api.get(`/companies?${params.toString()}`)
  return response.data
}
export const getCompany = async (id: string): Promise<CompanySchema> => {
  const response = await api.get(`/companies/${id}`)
  return response.data
}

export const createCompany = async (
  data: Partial<CompanySchema>
): Promise<CompanySchema> => {
  const response = await api.post('/companies', data)
  return response.data
}

export const updateCompany = async (
  id: string,
  data: Partial<CompanySchema>
): Promise<CompanySchema> => {
  const response = await api.patch(`/companies/${id}`, data)
  return response.data
}

export const deleteCompany = async (id: string): Promise<void> => {
  await api.delete(`/companies/${id}`)
}
