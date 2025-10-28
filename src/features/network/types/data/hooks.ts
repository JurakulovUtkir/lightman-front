import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getNetworkTypes,
  getNetworkType,
  createNetworkType,
  updateNetworkType,
  deleteNetworkType,
} from './api'
import { NetworkTypeSchema } from './schema'

export const useNetworkTypes = () => {
  return useQuery({
    queryKey: ['networkTypes'],
    queryFn: () => getNetworkTypes(),
  })
}
export const useNetworkType = (id: string) => {
  return useQuery<NetworkTypeSchema>({
    queryKey: ['networkType', id],
    queryFn: () => getNetworkType(id),
  })
}

export const useCreateNetworkType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createNetworkType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkTypes'] })
      toast.success('Network Type created successfully!')
    },
  })
}

export const useUpdateNetworkType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<NetworkTypeSchema>
    }) => updateNetworkType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkTypes'] })
      toast.success('Network Type updated successfully!')
    },
  })
}

export const useDeleteNetworkType = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteNetworkType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networkTypes'] })
      toast.success('Network Type deleted successfully!')
    },
  })
}
