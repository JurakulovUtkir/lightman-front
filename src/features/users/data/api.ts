import api from '@/lib/axios'
import { User } from './schema'
import { UsersResponse } from './types'

export const getUsers = async ({
  limit,
  offset,
  search,
  is_our_employee,
}: {
  limit?: number
  offset?: number
  search?: string
  is_our_employee?: boolean
}): Promise<UsersResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (is_our_employee !== undefined)
    params.append('is_our_employee', is_our_employee.toString())
  if (search) params.append('search', search)

  const response = await api.get(`/users?${params.toString()}`)
  return response.data
}

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.post('/auth/register', data)
  return response.data
}

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const response = await api.patch(`/users/${id}/edit`, data)
  return response.data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}/delete_account`)
}
