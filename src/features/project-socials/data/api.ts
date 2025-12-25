import api from '@/lib/axios'
import { ProjectSocialSchema } from './schema'
import {
  FileResponse,
  ProjectSocialResponse,
  ProjectSocialStatistics,
  ProjectExpenceStatistics,
} from './types'

export const getProjectSocials = async ({
  projectId,
  isPaid,
}: {
  projectId: string
  isPaid?: boolean
}): Promise<ProjectSocialResponse> => {
  const params = new URLSearchParams()

  if (projectId !== undefined) params.append('project_id', projectId)
  if (isPaid !== undefined) params.append('is_paid', isPaid.toString())

  const response = await api.get(`/project-socials?${params.toString()}`)
  return response.data
}
export const getProjectSocial = async (
  id: string
): Promise<ProjectSocialSchema> => {
  const response = await api.get(`/project-socials/${id}`)
  return response.data
}

export const createProjectSocial = async (
  data: Partial<ProjectSocialSchema>
): Promise<ProjectSocialSchema> => {
  const response = await api.post('/project-socials', data)
  return response.data
}

export const updateProjectSocial = async (
  id: string,
  data: Partial<ProjectSocialSchema>
): Promise<ProjectSocialSchema> => {
  const response = await api.patch(`/project-socials/${id}`, data)
  return response.data
}

export const deleteProjectSocial = async (id: string): Promise<void> => {
  await api.delete(`/project-socials/${id}`)
}

export const getProjectSocialStatistics = async (
  id: string
): Promise<ProjectSocialStatistics> => {
  const response = await api.get(`/project-socials/${id}/views`)
  return response.data
}
export const getProjectExpenceStatistics = async (
  id: string
): Promise<ProjectExpenceStatistics> => {
  const response = await api.get(`/expence/projects/${id}/details`)
  return response.data
}

// File CRUD

export const uploadFileApi = async (
  formData: FormData
): Promise<FileResponse> => {
  const response = await api.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const deleteFileApi = async (filePath: string): Promise<void> => {
  // Remove /assets/ prefix if it exists
  const cleanPath = filePath.replace(/^\/assets\//, '')

  await api.delete(`/files/${cleanPath}`)
}
