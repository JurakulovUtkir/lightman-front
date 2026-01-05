import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getUsers, getUser, createUser, updateUser, deleteUser } from './api'
import { User } from './schema'
import { UsersResponse } from './types'

export const useGetUsers = (
  {
    limit,
    offset,
    search,
    is_our_employee,
    role,
  }: {
    limit?: number
    offset?: number
    search?: string
    is_our_employee?: boolean
    role?: string
  },
  options?: {
    enabled?: boolean
  }
) => {
  return useQuery<UsersResponse>({
    queryKey: ['users', limit, offset, search, is_our_employee, role],
    queryFn: () =>
      getUsers({
        limit,
        offset,
        search,
        is_our_employee,
        role,
      }),
    enabled: options?.enabled ?? true, // Default to true if not provided
  })
}
export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => getUser(id),
    enabled: !!id,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully!')
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully!')
    },
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
