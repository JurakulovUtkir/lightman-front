import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getUsers, deleteUser } from './api'
import { UsersResponse } from './types'

export const useGetUsers = () => {
  return useQuery<UsersResponse>({
    queryKey: ['users'],
    queryFn: () => getUsers(),
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully!')
    },
  })
}
