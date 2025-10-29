import api from '@/lib/axios'
import { User } from './schema'
import { UsersResponse } from './types'

export const getUsers = async ({
  limit,
  offset,
}: {
  limit?: number
  offset?: number
}): Promise<UsersResponse> => {
  const response = await api.get(`/users?limit=${limit}&offset=${offset}`)
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
