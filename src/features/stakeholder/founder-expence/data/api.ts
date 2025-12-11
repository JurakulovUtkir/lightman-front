import api from '@/lib/axios'
import {
  CorporateExpenceType,
  ExpenceType,
  PaymentType,
} from '@/constants/enums'
import { ExpenceSchemaResponse } from '@/features/expences/data/types'

export const getFounderExpence = async ({
  id,
  limit,
  offset,
  search,
  type,
  expence_type,
  payment_type,
  distribution_id,
  company_id,
  project_id,
  user_id,
  date_from,
  date_to,
  max_amount,
  min_amount,
}: {
  id: string
  limit?: number
  offset?: number
  search?: string
  type?: CorporateExpenceType
  expence_type?: ExpenceType
  payment_type?: PaymentType
  distribution_id?: string
  company_id?: string
  project_id?: string
  user_id?: string
  date_from?: string
  date_to?: string
  max_amount?: number
  min_amount?: number
}): Promise<ExpenceSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)
  if (type) params.append('type', type)
  if (expence_type) params.append('expence_type', expence_type)
  if (payment_type) params.append('payment_type', payment_type)
  if (distribution_id) params.append('distribution_id', distribution_id)
  if (company_id) params.append('company_id', company_id)
  if (project_id) params.append('project_id', project_id)
  if (user_id) params.append('user_id', user_id)
  if (date_from) params.append('date_from', date_from)
  if (date_to) params.append('date_to', date_to)
  if (max_amount !== undefined)
    params.append('max_amount', max_amount.toString())
  if (min_amount !== undefined)
    params.append('min_amount', min_amount.toString())

  const response = await api.get(
    `/expence/founders/${id}/expences?${params.toString()}`
  )
  return response.data
}
