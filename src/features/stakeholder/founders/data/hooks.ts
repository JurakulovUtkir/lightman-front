import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getFounders,
  getFounder,
  createFounder,
  updateFounder,
  deleteFounder,
} from './api'
import { FounderSchema } from './schema'

export const useFounders = () => {
  return useQuery({
    queryKey: ['founders'],
    queryFn: () => getFounders(),
  })
}
export const useFounder = (id: string) => {
  return useQuery<FounderSchema>({
    queryKey: ['founder', id],
    queryFn: () => getFounder(id),
  })
}

export const useCreateFounder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFounder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founders'] })
      toast.success('Founder created successfully!')
    },
  })
}

export const useUpdateFounder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FounderSchema> }) =>
      updateFounder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founders'] })
      toast.success('Founder updated successfully!')
    },
  })
}

export const useDeleteFounder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFounder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['founders'] })
      toast.success('Founder deleted successfully!')
    },
  })
}
