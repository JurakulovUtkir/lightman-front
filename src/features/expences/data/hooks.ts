import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getExpences,
  getExpence,
  createExpence,
  updateExpence,
  deleteExpence,
} from './api'
import { ExpenceSchema } from './schema'

export const useExpences = ({
  limit,
  offset,
  search,
}: {
  limit?: number
  offset?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['expences', limit, offset, search],
    queryFn: () =>
      getExpences({
        limit,
        offset,
        search,
      }),
  })
}
export const useExpence = (id: string) => {
  return useQuery<ExpenceSchema>({
    queryKey: ['expence', id],
    queryFn: () => getExpence(id),
  })
}

export const useCreateExpence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createExpence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expences'] })
      toast.success('Expence created successfully!')
    },
  })
}

export const useUpdateExpence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenceSchema> }) =>
      updateExpence(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expences'] })
      toast.success('Expence updated successfully!')
    },
  })
}

export const useDeleteExpence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteExpence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expences'] })
      toast.success('Expence deleted successfully!')
    },
  })
}
