import api from '@/lib/axios'
import { ActionSchemaResponse } from './types'

export const getActions = async ({
  tag,
  success,
  user_id,
  from,
  to,
}: {
  tag?: string
  success?: boolean
  user_id?: string
  from?: string
  to?: string
}): Promise<ActionSchemaResponse> => {
  const params = new URLSearchParams()

  if (tag !== undefined) params.append('tag', tag.toString())
  if (success !== undefined) params.append('success', success.toString())
  if (user_id) params.append('user_id', user_id)
  if (from !== undefined) params.append('from', from.toString())
  if (to !== undefined) params.append('to', to.toString())

  const response = await api.get(`/actions?${params.toString()}`)
  return response.data
}
