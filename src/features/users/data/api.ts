import api from '@/lib/axios'
import { UsersResponse } from './types'

export const getUsers = async (): Promise<UsersResponse> => {
  const response = await api.get('/users/all')
  return response.data
}

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/delete_account/${id}`)
}
