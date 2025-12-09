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
  type,
  expence_type,
  payment_type,
  distribution_id,
  company_id,
  project_id,
  user_id,
  date_from,
  date_to,
  max_amount,
  min_amount,
}: {
  limit?: number
  offset?: number
  search?: string
  type?: 'expence' | 'income' | 'deposit'
  expence_type?:
    | 'salary'
    | 'avans'
    | 'project'
    | 'deposit'
    | 'other'
    | 'transfer'
  payment_type?: 'CARD' | 'BANK_TRANSFER' | 'CASH' | 'DEPOSIT'
  distribution_id?: string
  company_id?: string
  project_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
  max_amount?: number
  min_amount?: number
}) => {
  return useQuery({
    queryKey: [
      'expences',
      limit,
      offset,
      search,
      type,
      expence_type,
      payment_type,
      distribution_id,
      company_id,
      project_id,
      user_id,
      date_from,
      date_to,
      max_amount,
      min_amount,
    ],
    queryFn: () =>
      getExpences({
        limit,
        offset,
        search,
        type,
        expence_type,
        payment_type,
        distribution_id,
        company_id,
        project_id,
        user_id,
        date_from,
        date_to,
        max_amount,
        min_amount,
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
