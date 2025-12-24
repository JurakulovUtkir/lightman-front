import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from './api'
import { ProjectSchema } from './schema'

export const useProjects = ({
  limit,
  offset,
  search,
  status,
  price_type,
  customer_company_id,
  our_company_id,
  project_manager_id,
  category_id,
  distribution_id,
  min_price,
  max_price,
}: {
  limit?: number
  offset?: number
  search?: string
  status?:
    | 'draft'
    | 'active'
    | 'on_hold'
    | 'approved'
    | 'requested'
    | 'done'
    | 'canceled'
    | 'requested_to_done'
  price_type?: 'standard' | 'vip' | 'no_watermark'
  customer_company_id?: string
  our_company_id?: string
  project_manager_id?: string
  category_id?: string
  distribution_id?: string
  min_price?: number
  max_price?: number
}) => {
  return useQuery({
    queryKey: [
      'projects',
      limit,
      offset,
      search,
      status,
      price_type,
      customer_company_id,
      our_company_id,
      project_manager_id,
      category_id,
      distribution_id,
      min_price,
      max_price,
    ],
    queryFn: () =>
      getProjects({
        limit,
        offset,
        search,
        status,
        price_type,
        customer_company_id,
        our_company_id,
        project_manager_id,
        category_id,
        distribution_id,
        min_price,
        max_price,
      }),
  })
}
export const useProject = (id: string) => {
  return useQuery<ProjectSchema>({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: !!id,
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully!')
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectSchema> }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project updated successfully!')
    },
  })
}
export const useUpdateProjectStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectSchema> }) =>
      updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project updated successfully!')
    },
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project deleted successfully!')
    },
  })
}
