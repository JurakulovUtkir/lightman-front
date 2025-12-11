import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getLoans, getLoan, createLoan, updateLoan, deleteLoan } from './api'
import { LoanSchema } from './schema'

export const useLoans = ({
  limit,
  offset,
  search,
  direction,
}: {
  limit?: number
  offset?: number
  search?: string
  direction?: 'WE_GAVE' | 'WE_TOOK'
}) => {
  return useQuery({
    queryKey: ['loans', limit, offset, search, direction],
    queryFn: () =>
      getLoans({
        limit,
        offset,
        search,
        direction,
      }),
  })
}
export const useLoan = (id: string) => {
  return useQuery<LoanSchema>({
    queryKey: ['loan', id],
    queryFn: () => getLoan(id),
  })
}

export const useCreateLoan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      toast.success('Loan created successfully!')
    },
  })
}

export const useUpdateLoan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LoanSchema> }) =>
      updateLoan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      toast.success('Loan updated successfully!')
    },
  })
}

export const useDeleteLoan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loans'] })
      toast.success('Loan deleted successfully!')
    },
  })
}
