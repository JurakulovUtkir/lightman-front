import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getDeposits,
  getDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
} from './api'
import { DepositSchema } from './schema'

export const useDeposits = ({
  limit,
  offset,
  search,
}: {
  limit?: number
  offset?: number
  search?: string
}) => {
  return useQuery({
    queryKey: ['deposits', limit, offset, search],
    queryFn: () =>
      getDeposits({
        limit,
        offset,
        search,
      }),
  })
}
export const useDeposit = (id: string) => {
  return useQuery<DepositSchema>({
    queryKey: ['deposit', id],
    queryFn: () => getDeposit(id),
  })
}

export const useCreateDeposit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDeposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] })
      toast.success('Deposit created successfully!')
    },
  })
}

export const useUpdateDeposit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DepositSchema> }) =>
      updateDeposit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] })
      toast.success('Deposit updated successfully!')
    },
  })
}

export const useDeleteDeposit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDeposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] })
      toast.success('Deposit deleted successfully!')
    },
  })
}
