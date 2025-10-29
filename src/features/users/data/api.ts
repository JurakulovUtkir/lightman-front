import api from '@/lib/axios'
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

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}/delete_account`)
}
