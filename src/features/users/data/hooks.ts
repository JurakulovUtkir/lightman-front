import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getUsers, deleteUser } from './api'
import { UsersResponse } from './types'

export const useGetUsers = ({
  limit,
  offset,
}: {
  limit?: number
  offset?: number
}) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', limit, offset],
    queryFn: () =>
      getUsers({
        limit,
        offset,
      }),
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
