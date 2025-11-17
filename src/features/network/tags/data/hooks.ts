import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getNetworkTags,
  getNetworkTag,
  createNetworkTag,
  updateNetworkTag,
  deleteNetworkTag,
} from './api'
import { NetworkTagSchema } from './schema'

export const useNetworkTags = ({
  offset,
  limit,
  search,
}: {
  offset?: number
  limit?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['tags', offset, limit, search],
    queryFn: () =>
      getNetworkTags({
        offset,
        limit,
        search,
      }),
  })
}
export const useNetworkTag = (id: string) => {
  return useQuery<NetworkTagSchema>({
    queryKey: ['tag', id],
    queryFn: () => getNetworkTag(id),
  })
}

export const useCreateNetworkTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createNetworkTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Network Tag created successfully!')
    },
  })
}

export const useUpdateNetworkTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<NetworkTagSchema>
    }) => updateNetworkTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Network Tag updated successfully!')
    },
  })
}

export const useDeleteNetworkTag = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteNetworkTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Network Tag deleted successfully!')
    },
  })
}
