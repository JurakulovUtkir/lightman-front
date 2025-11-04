import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getProjectSocials,
  getProjectSocial,
  createProjectSocial,
  updateProjectSocial,
  deleteProjectSocial,
} from './api'
import { ProjectSocialSchema } from './schema'

export const useProjectSocials = (id: string) => {
  return useQuery({
    queryKey: ['project-socials', id],
    queryFn: () => getProjectSocials(id),
    enabled: !!id,
  })
}
export const useProjectSocial = (id: string) => {
  return useQuery<ProjectSocialSchema>({
    queryKey: ['project-social', id],
    queryFn: () => getProjectSocial(id),
  })
}

export const useCreateProjectSocial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProjectSocial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-socials'] })
      toast.success('Project social created successfully!')
    },
  })
}

export const useUpdateProjectSocial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<ProjectSocialSchema>
    }) => updateProjectSocial(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-socials'] })
      toast.success('Project social updated successfully!')
    },
  })
}

export const useDeleteProjectSocial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProjectSocial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-socials'] })
      toast.success('Project social deleted successfully!')
    },
  })
}
