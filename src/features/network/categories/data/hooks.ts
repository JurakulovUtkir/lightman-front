import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from './api'
import { NetworkCategorySchema } from './schema'

export const useNetworkCategories = ({
  limit,
  offset,
  search = '',
}: {
  limit?: number
  offset?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['categories', limit, offset, search],
    queryFn: () =>
      getCategories({
        limit,
        offset,
        search,
      }),
  })
}
export const useNetworkCategory = (id: string) => {
  return useQuery<NetworkCategorySchema>({
    queryKey: ['category', id],
    queryFn: () => getCategory(id),
  })
}

export const useCreateNetworkCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Network Category created successfully!')
    },
  })
}

export const useUpdateNetworkCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<NetworkCategorySchema>
    }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Network Category updated successfully!')
    },
  })
}

export const useDeleteNetworkCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Network Category deleted successfully!')
    },
  })
}
