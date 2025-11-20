import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { NetworkCategorySchema } from './schema'
import { NetworkCategoryResponse } from './types'

export const getCategories = async ({
  limit,
  offset,
  search,
}: {
  limit?: number
  offset?: number
  search?: string
}): Promise<NetworkCategoryResponse> => {
  const response = await api.get(
    `/categories?limit=${limit}&offset=${offset}${search && `&search=${search}`}`
  )
  return response.data
}
export const getCategory = async (
  id: string
): Promise<NetworkCategorySchema> => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const createCategory = async (
  data: Partial<NetworkCategorySchema>
): Promise<ApiResponse<NetworkCategorySchema>> => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (
  id: string,
  data: Partial<NetworkCategorySchema>
): Promise<NetworkCategorySchema> => {
  const response = await api.patch(`/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`)
}
