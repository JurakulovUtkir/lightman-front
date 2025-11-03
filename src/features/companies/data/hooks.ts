import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from './api'
import { CompanySchema } from './schema'

export const useCompanies = ({
  limit,
  offset,
  search,
  is_active,
  is_our_company,
  is_vip,
}: {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
  is_our_company?: boolean
  is_vip?: boolean
}) => {
  return useQuery({
    queryKey: [
      'companies',
      limit,
      offset,
      search,
      is_active,
      is_our_company,
      is_vip,
    ],
    queryFn: () =>
      getCompanies({
        limit,
        offset,
        search,
        is_active,
        is_our_company,
        is_vip,
      }),
  })
}
export const useCompany = (id: string) => {
  return useQuery<CompanySchema>({
    queryKey: ['company', id],
    queryFn: () => getCompany(id),
  })
}

export const useCreateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Company created successfully!')
    },
  })
}

export const useUpdateCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CompanySchema> }) =>
      updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Company updated successfully!')
    },
  })
}

export const useDeleteCompany = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Company deleted successfully!')
    },
  })
}
