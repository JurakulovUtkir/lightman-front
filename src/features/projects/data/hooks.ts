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
  is_active,
}: {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
}) => {
  return useQuery({
    queryKey: ['projects', limit, offset, search, is_active],
    queryFn: () =>
      getProjects({
        limit,
        offset,
        search,
        is_active,
      }),
  })
}
export const useProject = (id: string) => {
  return useQuery<ProjectSchema>({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
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
