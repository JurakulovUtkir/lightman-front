import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getDistributors,
  getDistributor,
  createDistributor,
  updateDistributor,
  deleteDistributor,
} from './api'
import { DistributorSchema } from './schema'

export const useDistributors = (id: string) => {
  return useQuery({
    queryKey: ['distributors', id],
    queryFn: () => getDistributors(id),
    enabled: !!id,
  })
}
export const useDistributor = (id: string) => {
  return useQuery<DistributorSchema>({
    queryKey: ['distributor', id],
    queryFn: () => getDistributor(id),
  })
}

export const useCreateDistributor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDistributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributors'] })
      toast.success('Distributor created successfully!')
    },
  })
}

export const useUpdateDistributor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<DistributorSchema>
    }) => updateDistributor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributors'] })
      toast.success('Distributor updated successfully!')
    },
  })
}

export const useDeleteDistributor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDistributor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributors'] })
      toast.success('Distributor deleted successfully!')
    },
  })
}
