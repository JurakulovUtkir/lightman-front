import { ApiResponse } from '@/constants'
import api from '@/lib/axios'
import { ProjectSchema } from './schema'
import { ProjectSchemaResponse } from './types'

export const getProjects = async ({
  limit,
  offset,
  search,
  is_active,
}: {
  limit?: number
  offset?: number
  search?: string
  is_active?: boolean
}): Promise<ProjectSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)
  if (is_active !== undefined) params.append('is_active', is_active.toString())

  const response = await api.get(`/projects?${params.toString()}`)
  return response.data
}
export const getProject = async (id: string): Promise<ProjectSchema> => {
  const response = await api.get<ApiResponse<ProjectSchema>>(`/projects/${id}`)
  return response.data.data
}

export const createProject = async (
  data: Partial<ProjectSchema>
): Promise<ProjectSchema> => {
  const response = await api.post('/projects', data)
  return response.data
}

export const updateProject = async (
  id: string,
  data: Partial<ProjectSchema>
): Promise<ProjectSchema> => {
  const response = await api.patch(`/projects/${id}`, data)
  return response.data
}

export const deleteProject = async (id: string): Promise<void> => {
  await api.delete(`/projects/${id}`)
}
