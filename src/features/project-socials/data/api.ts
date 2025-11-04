import api from '@/lib/axios'
import { ProjectSocialSchema } from './schema'
import { ProjectSocialResponse } from './types'

export const getProjectSocials = async (
  id: string
): Promise<ProjectSocialResponse> => {
  const response = await api.get(`/project-socials?project_id=${id}`)
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
