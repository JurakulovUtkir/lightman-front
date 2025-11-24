import api from '@/lib/axios'
import { ExpenceSchemaResponse } from '@/features/expences/data/types'

export const getFounderExpence = async ({
  id,
  limit,
  offset,
  search,
}: {
  id: string
  limit?: number
  offset?: number
  search?: string
}): Promise<ExpenceSchemaResponse> => {
  const params = new URLSearchParams()

  if (limit !== undefined) params.append('limit', limit.toString())
  if (offset !== undefined) params.append('offset', offset.toString())
  if (search) params.append('search', search)

  const response = await api.get(
    `/expence/founders/${id}/expences?${params.toString()}`
  )
  return response.data
}
