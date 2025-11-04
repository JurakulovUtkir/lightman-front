import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getSocials,
  getSocial,
  createSocial,
  updateSocial,
  deleteSocial,
} from './api'
import { NetworkSocialSchema } from './schema'

export const useNetworkSocials = ({
  limit,
  offset,
  search,
  category_id,
  social_network_type_id,
}: {
  limit?: number
  offset?: number
  search?: string
  category_id?: string
  social_network_type_id?: string
}) => {
  return useQuery({
    queryKey: [
      'socials',
      limit,
      offset,
      search,
      category_id,
      social_network_type_id,
    ],
    queryFn: () =>
      getSocials({
        limit,
        offset,
        search,
        category_id,
        social_network_type_id,
      }),
  })
}
export const useNetworkSocial = (id: string) => {
  return useQuery<NetworkSocialSchema>({
    queryKey: ['social', id],
    queryFn: () => getSocial(id),
  })
}

export const useCreateNetworkSocial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSocial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] })
      toast.success('Network Social created successfully!')
    },
  })
}

export const useUpdateNetworkSocial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<NetworkSocialSchema>
    }) => updateSocial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] })
      toast.success('Network Social updated successfully!')
    },
  })
}

export const useDeleteNetworkSocial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSocial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socials'] })
      toast.success('Network Social deleted successfully!')
    },
  })
}
