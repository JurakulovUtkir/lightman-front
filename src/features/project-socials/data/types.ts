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
export type ProjectExpenceStatistics = ApiResponse<{
  given_amount: string
  project_id: string
  project_name: string
  total_expensed_by_service: number
  total_income: number
  total_planned_buy_expense: number
  total_planned_sell_expense: number
}>
