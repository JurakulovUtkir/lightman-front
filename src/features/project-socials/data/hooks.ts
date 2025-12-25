import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getProjectSocials,
  getProjectSocial,
  createProjectSocial,
  updateProjectSocial,
  deleteProjectSocial,
  uploadFileApi,
  deleteFileApi,
  getProjectSocialStatistics,
  getProjectExpenceStatistics,
} from './api'
import { ProjectSocialSchema } from './schema'

export const useProjectSocials = ({
  projectId,
  isPaid,
}: {
  projectId: string
  isPaid?: boolean
}) => {
  return useQuery({
    queryKey: ['project-socials', projectId, isPaid],
    queryFn: () => getProjectSocials({ projectId, isPaid }),
    enabled: !!projectId,
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
      queryClient.invalidateQueries({
        queryKey: ['project-socials-statistics'],
      })
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
      queryClient.invalidateQueries({
        queryKey: ['project-socials-statistics'],
      })
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
      queryClient.invalidateQueries({
        queryKey: ['project-socials-statistics'],
      })
      toast.success('Project social deleted successfully!')
    },
  })
}

export const useProjectSocialStatistics = (id: string) => {
  return useQuery({
    queryKey: ['project-socials-statistics', id],
    queryFn: () => getProjectSocialStatistics(id),
    enabled: !!id,
  })
}
export const useProjectExpenceStatistics = (id: string) => {
  return useQuery({
    queryKey: ['project-expence-statictics', id],
    queryFn: () => getProjectExpenceStatistics(id),
    enabled: !!id,
  })
}

// File CRUD:
export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadFileApi,
  })
}

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: deleteFileApi,
  })
}
