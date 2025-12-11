import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { ProjectSchema } from './schema'
import { ProjectSchemaResponse } from './types'

export const getProjects = async ({
  limit,
  offset,
  search,
  status,
  price_type,
  customer_company_id,
  our_company_id,
  category_id,
  distribution_id,
  min_price,
  max_price,
}: {
  limit?: number
  offset?: number
  search?: string
  status?:
    | 'draft'
    | 'active'
    | 'on_hold'
    | 'approved'
    | 'requested'
    | 'done'
    | 'canceled'
    | 'requested_to_done'
  price_type?: 'standard' | 'vip' | 'no_watermark'
  customer_company_id?: string
  our_company_id?: string
  category_id?: string
  distribution_id?: string
  min_price?: number
  max_price?: number
}): Promise<ProjectSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)
  if (status) params.append('status', status)
  if (price_type) params.append('price_type', price_type)
  if (customer_company_id)
    params.append('customer_company_id', customer_company_id)
  if (our_company_id) params.append('our_company_id', our_company_id)
  if (category_id) params.append('category_id', category_id)
  if (distribution_id) params.append('distribution_id', distribution_id)
  if (min_price !== undefined) params.append('min_price', min_price.toString())
  if (max_price !== undefined) params.append('max_price', max_price.toString())

  const response = await api.get(`/projects?${params.toString()}`)
  return response.data
}

export const getProject = async (id: string): Promise<ProjectSchema> => {
  const response = await api.get<ApiResponse<ProjectSchema>>(`/projects/${id}`)
  return response.data.data
}

export const createProject = async (
  data: Partial<ProjectSchema>
): Promise<ProjectSchema> => {
  const response = await api.post('/projects', data)
  return response.data
}

export const updateProject = async (
  id: string,
  data: Partial<ProjectSchema>
): Promise<ProjectSchema> => {
  const response = await api.patch(`/projects/${id}`, data)
  return response.data
}

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`)
}
