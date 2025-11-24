import { ApiResponse } from '@/constants'
import { ProjectSocialSchema } from './schema'

export type ProjectSocialResponse = ApiResponse<ProjectSocialSchema[]>

interface FileData {
  id: string
  filename: string
  originalName: string
  size: number
  path: string
  uploadedAt: string
}

export type FileResponse = ApiResponse<FileData>

export type ProjectSocialStatistics = ApiResponse<{
  planned_views_count: number
  actual_views_count: number
}>
