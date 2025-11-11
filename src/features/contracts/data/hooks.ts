import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getContracts,
  getContract,
  createContract,
  updateContract,
  deleteContract,
} from './api'
import { ContractSchema } from './schema'

export const useContracts = ({
  limit,
  offset,
  search,
  is_active,
}: {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
}) => {
  return useQuery({
    queryKey: ['contracts', limit, offset, search, is_active],
    queryFn: () =>
      getContracts({
        limit,
        offset,
        search,
        is_active,
      }),
  })
}
export const useContract = (id: string) => {
  return useQuery<ContractSchema>({
    queryKey: ['contract', id],
    queryFn: () => getContract(id),
    enabled: !!id,
  })
}

export const useCreateContract = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      toast.success('Contract created successfully!')
    },
  })
}

export const useUpdateContract = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContractSchema> }) =>
      updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      toast.success('Contract updated successfully!')
    },
  })
}

export const useDeleteContract = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      toast.success('Contract deleted successfully!')
    },
  })
}
