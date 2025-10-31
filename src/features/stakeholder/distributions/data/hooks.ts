import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getDistributions,
  getDistribution,
  createDistribution,
  updateDistribution,
  deleteDistribution,
} from './api'
import { DistributionSchema } from './schema'

export const useDistributions = () => {
  return useQuery({
    queryKey: ['distributions'],
    queryFn: () => getDistributions(),
  })
}
export const useDistribution = (id: string) => {
  return useQuery<DistributionSchema>({
    queryKey: ['distribution', id],
    queryFn: () => getDistribution(id),
  })
}

export const useCreateDistribution = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDistribution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributions'] })
      toast.success('Distribution created successfully!')
    },
  })
}

export const useUpdateDistribution = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<DistributionSchema>
    }) => updateDistribution(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributions'] })
      toast.success('Distribution updated successfully!')
    },
  })
}

export const useDeleteDistribution = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDistribution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributions'] })
      toast.success('Distribution deleted successfully!')
    },
  })
}
