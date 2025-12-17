import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'
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
  loan_id,
  card_id,
}: {
  limit?: number
  offset?: number
  search?: string
  type?: CorporateExpenceType
  expence_type?: ExpenceType
  payment_type?: PaymentType
  distribution_id?: string
  company_id?: string
  project_id?: string
  user_id?: string
  loan_id?: string
  card_id?: string
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
      loan_id,
      card_id,
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
        loan_id,
        card_id,
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
